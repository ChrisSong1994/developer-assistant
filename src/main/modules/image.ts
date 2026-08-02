import { dialog, OpenDialogOptions } from 'electron';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import { Worker } from 'worker_threads';

import { getConfData } from '../store';

export enum EImageStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure',
}
export interface IImageCompressInfo {
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

const INIT_IMAGE_INFO = {
  compreeedFileSize: null,
  compreeedFilePath: null,
  compressedRatio: null,
  status: EImageStatus.PENDING,
};

export const getImagesInfoFromPath = async (filePath: string | Array<string>): Promise<Array<IImageCompressInfo>> => {
  const filePaths = Array.isArray(filePath) ? filePath : [filePath];
  const imagesInfoPromises = filePaths.map(async (fpath) => {
    const { base: fileName, ext: format } = path.parse(fpath);
    const { size: originalFileSize } = await fs.stat(fpath);
    return {
      ...INIT_IMAGE_INFO,
      fileName,
      originalFileSize,
      format,
      originalFilePath: fpath,
    };
  });
  const result = await Promise.all(imagesInfoPromises);
  return result;
};

/**
 * payload: base64 string
 */
export const saveBase64ImageToLocal = async (
  options: OpenDialogOptions & { fileName: string; payload: string; format: 'png' | 'jpg' | 'jpeg' | 'webp' | 'svg' },
) => {
  const { downloadPath } = await getConfData();
  const result = await dialog.showSaveDialog(global.mainWindow, {
    ..._.omit(options, ['defaultPath', 'fileName']),
    defaultPath: options.defaultPath || `${downloadPath}/${options.fileName}`,
    properties: ['createDirectory', 'showOverwriteConfirmation'],
  });
  if (!result.canceled && result.filePath) {
    let buffer = Buffer.from(options.payload, 'base64');
    await fs.writeFile(result.filePath, buffer);
  }
};

export const uploadImages = async (options: OpenDialogOptions = {}) => {
  const { downloadPath } = await getConfData();
  const result = await dialog.showOpenDialog(global.mainWindow, {
    properties: ['openFile', 'openDirectory', 'createDirectory', 'multiSelections'],
    defaultPath: downloadPath,
    ...options,
  });

  if (result.canceled) {
    return null;
  }
  return await getImagesInfoFromPath(result.filePaths);
};

let compressWorker: Worker | null = null;

export const imageCompress = async ({ data, quality = 80 }: { data: Array<IImageCompressInfo>; quality: number }) => {
  const { downloadPath } = await getConfData();
  const workerScriptPath = path.join(__dirname, 'imageCompressWorker.js');

  const result = await new Promise<IImageCompressInfo[]>((resolve, reject) => {
    let settled = false;
    const worker = new Worker(workerScriptPath, {
      workerData: {
        data,
        quality,
        downloadPath,
      },
    });
    compressWorker = worker;

    worker.on('message', (message: any) => {
      if (message?.type === 'item') {
        // 逐张进度推送给渲染进程,表格实时更新
        global.mainWindow?.webContents.send('imageCompress:item', message.image);
      } else if (message?.type === 'done') {
        settled = true;
        compressWorker = null;
        void worker.terminate();
        resolve(message.data);
      } else if (message?.type === 'error') {
        const err = new Error(message?.error?.message || 'Image compress worker error');
        (err as any).stack = message?.error?.stack;
        settled = true;
        compressWorker = null;
        void worker.terminate();
        reject(err);
      }
    });
    worker.on('error', (err) => {
      if (settled) return;
      settled = true;
      compressWorker = null;
      reject(err);
    });
    worker.on('exit', (code) => {
      if (settled) return;
      if (code !== 0) {
        settled = true;
        compressWorker = null;
        reject(new Error(`Image compress worker stopped with exit code ${code}`));
      }
    });
  });

  return result;
};

export const cancelImageCompress = () => {
  compressWorker?.terminate();
  compressWorker = null;
  return true;
};
