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

interface IImageCompressInfo {
  fileName: string;
  originalFileSize: number;
  originalFilePath: string;
  compreeedFileSize: number | null;
  compreeedFilePath: string | null;
  compressedRatio: number | null;
  format: string;
  status: EImageStatus;
  errorMessage?: string;
}

// 批量压缩时关掉 libvips 缓存,避免长期内存膨胀
sharp.cache(false);
// 单 worker 内有界并发(sharp 内部走 libvips 线程池,不占主进程事件循环)
const CONCURRENCY = Math.max(1, Math.min(os.cpus().length, 4));
sharp.concurrency(CONCURRENCY);

// 各格式压缩参数,quality 对应界面 高/中/低(80/50/30)
const FORMAT_OPTIONS = {
  png: (quality: number) => ({ quality, palette: true, compressionLevel: 9 }),
  jpg: (quality: number) => ({ quality, mozjpeg: true }),
  jpeg: (quality: number) => ({ quality, mozjpeg: true }),
  webp: (quality: number) => ({ quality, effort: 4 }),
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

async function compressOne(image: IImageCompressInfo, quality: number, downloadPath: string): Promise<IImageCompressInfo> {
  const format = (image.format || '').replace(/^\./, '').toLowerCase();
  const formatOptions = FORMAT_OPTIONS[format];

  if (!formatOptions) {
    const failed = { ...image, status: EImageStatus.FAILURE, errorMessage: `暂不支持的图片格式: ${image.format || '未知'}` };
    return failed;
  }

  const compreeedFilePath = getNotExistFilePath(path.join(downloadPath, path.basename(image.originalFilePath)));
  try {
    // failOn: 'none' 容错损坏图片;rotate() 按 EXIF 自动转正
    await sharp(image.originalFilePath, { failOn: 'none' })
      .rotate()
      .toFormat(format, formatOptions(quality))
      .toFile(compreeedFilePath);

    const { size: compreeedFileSize } = await fs.stat(compreeedFilePath);
    // failOn:'none' 下损坏图可能输出 0 字节,显式判为失败
    if (compreeedFileSize <= 0) {
      await fs.remove(compreeedFilePath);
      throw new Error('图片损坏或格式无效');
    }
    const compressedRatio = Number((((image.originalFileSize - compreeedFileSize) / image.originalFileSize) * 100).toFixed(1));
    return {
      ...image,
      status: EImageStatus.SUCCESS,
      compreeedFilePath,
      compreeedFileSize,
      compressedRatio,
    };
  } catch (error: any) {
    return {
      ...image,
      status: EImageStatus.FAILURE,
      errorMessage: error?.message || String(error),
    };
  }
}

async function compressImages(params: { data: IImageCompressInfo[]; quality: number; downloadPath: string }) {
  const { data, quality, downloadPath } = params;
  const results: IImageCompressInfo[] = new Array(data.length);

  let idx = 0;
  // 有界并发池:每个并发任务从数组尾部取一张,完成后立即 postMessage 逐张进度
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (idx < data.length) {
        const i = idx++;
        const image = data[i];
        if (image.status !== EImageStatus.PENDING || !fs.existsSync(image.originalFilePath)) {
          results[i] = image.status !== EImageStatus.PENDING
            ? image
            : { ...image, status: EImageStatus.FAILURE, errorMessage: '原文件路径不存在' };
        } else {
          results[i] = await compressOne(image, quality, downloadPath);
        }
        parentPort?.postMessage({ type: 'item', index: i, image: results[i] });
      }
    }),
  );

  return results;
}

async function main() {
  const { data, quality = 80, downloadPath } = workerData as {
    data: IImageCompressInfo[];
    quality: number;
    downloadPath: string;
  };
  const result = await compressImages({ data, quality, downloadPath });
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
