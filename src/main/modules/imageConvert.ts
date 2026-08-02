import { dialog, OpenDialogOptions } from 'electron';
import path from 'path';
import { Worker } from 'worker_threads';

import { getConfData } from '../store';
import { getImagesInfoFromPath } from './image';
import { EImageStatus } from './image';

export interface IImageConvertInfo {
  fileName: string;
  originalFileSize: number;
  originalFilePath: string; // rowKey / 去重主键
  outputFileSize: number | null;
  outputFilePath: string | null;
  format: string; // 原格式 '.png'
  targetFormat: string; // 目标格式 'webp'（每行可覆盖）
  status: EImageStatus;
  errorMessage?: string;
  /** 单行独立的转换质量,未设置时走全局/默认质量 */
  quality?: number;
}

export const uploadConvertImages = async (options: OpenDialogOptions = {}) => {
  const { downloadPath } = await getConfData();
  const result = await dialog.showOpenDialog(global.mainWindow, {
    properties: ['openFile', 'multiSelections'],
    defaultPath: downloadPath,
    ...options,
  });

  if (result.canceled) {
    return null;
  }
  const infos = await getImagesInfoFromPath(result.filePaths);
  return infos.map((info) => ({
    ...info,
    targetFormat: 'webp',
    outputFileSize: null,
    outputFilePath: null,
  }));
};

// 单个转换与批量转换可能并存,用 Set 管理多个 worker,取消时全部终止
const convertWorkers = new Set<Worker>();

export const imageConvert = async ({
  data,
  targetFormat,
  quality = 80,
  width,
}: {
  data: Array<IImageConvertInfo>;
  targetFormat: string;
  quality: number;
  width?: number;
}) => {
  const { downloadPath } = await getConfData();
  const workerScriptPath = path.join(__dirname, 'imageConvertWorker.js');

  const result = await new Promise<IImageConvertInfo[]>((resolve, reject) => {
    let settled = false;
    const worker = new Worker(workerScriptPath, {
      workerData: {
        data,
        targetFormat,
        quality,
        width,
        downloadPath,
      },
    });
    convertWorkers.add(worker);
    const cleanup = () => convertWorkers.delete(worker);

    worker.on('message', (message: any) => {
      if (message?.type === 'item') {
        // 逐张进度推送给渲染进程,表格实时更新
        global.mainWindow?.webContents.send('imageConvert:item', message.image);
      } else if (message?.type === 'done') {
        settled = true;
        cleanup();
        void worker.terminate();
        resolve(message.data);
      } else if (message?.type === 'error') {
        const err = new Error(message?.error?.message || 'Image convert worker error');
        (err as any).stack = message?.error?.stack;
        settled = true;
        cleanup();
        void worker.terminate();
        reject(err);
      }
    });
    worker.on('error', (err) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err);
    });
    worker.on('exit', (code) => {
      if (settled) return;
      if (code !== 0) {
        settled = true;
        cleanup();
        reject(new Error(`Image convert worker stopped with exit code ${code}`));
      }
    });
  });

  return result;
};

export const cancelImageConvert = () => {
  convertWorkers.forEach((worker) => worker.terminate());
  convertWorkers.clear();
  return true;
};
