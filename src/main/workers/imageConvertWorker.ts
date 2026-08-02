import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import { parentPort, workerData } from 'worker_threads';

enum EImageStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

interface IImageConvertInfo {
  fileName: string;
  originalFileSize: number;
  originalFilePath: string;
  outputFileSize: number | null;
  outputFilePath: string | null;
  format: string;
  targetFormat: string;
  status: EImageStatus;
  errorMessage?: string;
  quality?: number;
}

// 批量转换时关掉 libvips 缓存,避免长期内存膨胀
sharp.cache(false);
// 单 worker 内有界并发(sharp 内部走 libvips 线程池,不占主进程事件循环)
const CONCURRENCY = Math.max(1, Math.min(os.cpus().length, 4));
sharp.concurrency(CONCURRENCY);

// 目标格式 → 编码参数;png/gif 无损,忽略质量
const TARGET_FORMAT_OPTIONS: Record<string, (quality: number) => Record<string, unknown>> = {
  jpeg: (quality) => ({ quality, mozjpeg: true }),
  png: () => ({ compressionLevel: 9, palette: true }),
  webp: (quality) => ({ quality, effort: 4 }),
  avif: (quality) => ({ quality, effort: 4 }),
  gif: () => ({}),
};

function getNotExistFilePath(filePath: string): string {
  if (!fs.existsSync(filePath)) return filePath;
  const pathObject = path.parse(filePath);
  let index = 1;
  let newFilePath = path.format({
    ...pathObject,
    name: `${pathObject.name}(${index})`,
    base: `${pathObject.name}(${index})${pathObject.ext}`,
  });
  while (fs.existsSync(newFilePath)) {
    index++;
    newFilePath = path.format({
      ...pathObject,
      name: `${pathObject.name}(${index})`,
      base: `${pathObject.name}(${index})${pathObject.ext}`,
    });
  }
  return newFilePath;
}

async function convertOne(
  image: IImageConvertInfo,
  params: { targetFormat: string; quality: number; width?: number },
  downloadPath: string,
): Promise<IImageConvertInfo> {
  const targetFormat = image.targetFormat || params.targetFormat;
  const formatOptions = TARGET_FORMAT_OPTIONS[targetFormat];

  if (!formatOptions) {
    return {
      ...image,
      status: EImageStatus.FAILURE,
      errorMessage: `暂不支持的目标格式: ${targetFormat || '未知'}`,
    };
  }

  // 源格式与目标格式一致,无需转换
  const sourceFormat = (image.format || '').replace(/^\./, '').toLowerCase();
  if (sourceFormat === targetFormat) {
    return {
      ...image,
      status: EImageStatus.FAILURE,
      errorMessage: `已是 ${targetFormat} 格式`,
    };
  }

  // 输出名 = 原文件名(去扩展名) + '.' + 目标格式
  const baseName = path.basename(image.originalFilePath, path.extname(image.originalFilePath));
  const outputFilePath = getNotExistFilePath(path.join(downloadPath, `${baseName}.${targetFormat}`));
  try {
    let pipeline = sharp(image.originalFilePath, { failOn: 'none' }).rotate();
    // 可选宽度等比缩放,不放大小图
    if (params.width) {
      pipeline = pipeline.resize({ width: params.width, withoutEnlargement: true });
    }
    // 含透明通道转 jpeg 时铺白底,避免默认黑底
    if (targetFormat === 'jpeg') {
      pipeline = pipeline.flatten({ background: '#ffffff' });
    }

    await pipeline.toFormat(targetFormat, formatOptions(params.quality)).toFile(outputFilePath);

    const { size: outputFileSize } = await fs.stat(outputFilePath);
    // failOn:'none' 下损坏图可能输出 0 字节,显式判为失败
    if (outputFileSize <= 0) {
      await fs.remove(outputFilePath);
      throw new Error('图片损坏或格式无效');
    }
    return {
      ...image,
      status: EImageStatus.SUCCESS,
      targetFormat,
      outputFilePath,
      outputFileSize,
    };
  } catch (error: any) {
    return {
      ...image,
      status: EImageStatus.FAILURE,
      targetFormat,
      errorMessage: error?.message || String(error),
    };
  }
}

async function convertImages(params: {
  data: IImageConvertInfo[];
  targetFormat: string;
  quality: number;
  width?: number;
  downloadPath: string;
}) {
  const { data, targetFormat, quality, width, downloadPath } = params;
  const results: IImageConvertInfo[] = new Array(data.length);

  let idx = 0;
  // 有界并发池:每个并发任务从数组尾部取一张,完成后立即 postMessage 逐张进度
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (idx < data.length) {
        const i = idx++;
        const image = data[i];
        if (image.status !== EImageStatus.PENDING || !fs.existsSync(image.originalFilePath)) {
          results[i] =
            image.status !== EImageStatus.PENDING
              ? image
              : { ...image, status: EImageStatus.FAILURE, errorMessage: '原文件路径不存在' };
        } else {
          results[i] = await convertOne(image, { targetFormat, quality, width }, downloadPath);
        }
        parentPort?.postMessage({ type: 'item', index: i, image: results[i] });
      }
    }),
  );

  return results;
}

async function main() {
  const { data, targetFormat, quality = 80, width, downloadPath } = workerData as {
    data: IImageConvertInfo[];
    targetFormat: string;
    quality: number;
    width?: number;
    downloadPath: string;
  };
  const result = await convertImages({ data, targetFormat, quality, width, downloadPath });
  parentPort?.postMessage({ type: 'done', data: result });
}

main().catch((error: any) => {
  parentPort?.postMessage({
    type: 'error',
    error: {
      message: error?.message || String(error),
      stack: error?.stack,
    },
  });
});
