import fs from 'fs-extra';
import path from 'path';
import { parentPort, workerData } from 'worker_threads';

// @ts-ignore
import imageTiny from '../lib/imageTiny';

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

async function compressImages(params: { data: IImageCompressInfo[]; quality: number; downloadPath: string }) {
  const { data, quality, downloadPath } = params;
  const results: IImageCompressInfo[] = [];

  for (let i = 0; i < data.length; i++) {
    const image = data[i];
    if (image.status !== EImageStatus.PENDING) {
      results.push(image);
      continue;
    }
    if (!fs.existsSync(image.originalFilePath)) {
      const updated = { ...image, status: EImageStatus.FAILURE, errorMessage: '原文件路径不存在' };
      results.push(updated);
      parentPort?.postMessage({ type: 'item', index: i, image: updated });
      continue;
    }

    const compreeedFilePath = getNotExistFilePath(path.join(downloadPath, path.basename(image.originalFilePath)));
    const buffer = await fs.readFile(image.originalFilePath);
    const compressedBuffer = await imageTiny(buffer, quality);
    const compreeedFileSize = Buffer.byteLength(compressedBuffer);
    const compressedRatio = Number(
      (((image.originalFileSize - compreeedFileSize) / image.originalFileSize) * 100).toFixed(1),
    );
    await fs.writeFile(compreeedFilePath, compressedBuffer);
    const updated = {
      ...image,
      status: EImageStatus.SUCCESS,
      compreeedFilePath,
      compreeedFileSize,
      compressedRatio,
    };
    results.push(updated);
    parentPort?.postMessage({ type: 'item', index: i, image: updated });
  }

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
