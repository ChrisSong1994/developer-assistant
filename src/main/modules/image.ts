import { dialog, OpenDialogOptions } from 'electron';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';

// @ts-ignore
import imageTiny from '../lib/imageTiny';
import { getNotExistFilePath } from '../utils';
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
  options: OpenDialogOptions & { fileName: string; payload: string; format: 'png' | 'jpg' | 'jpeg' | 'webp' },
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

export const imageCompress = async ({ data, quality = 80 }: { data: Array<IImageCompressInfo>; quality: number }) => {
  const { downloadPath } = await getConfData();
  const imageCompressPromises = data.map(async (image) => {
    if (image.status !== EImageStatus.PENDING) return image;
    if (!fs.existsSync(image.originalFilePath)) {
      return { ...image, status: EImageStatus.FAILURE, errorMessage: '原文件路径不存在' };
    }
    const compreeedFilePath = getNotExistFilePath(path.join(downloadPath, path.basename(image.originalFilePath)));
    const buffer = await fs.readFile(image.originalFilePath);
    const compressedBuffer = await imageTiny(buffer, quality);
    const compreeedFileSize = Buffer.byteLength(compressedBuffer);
    const compressedRatio = (((image.originalFileSize - compreeedFileSize) / image.originalFileSize) * 100).toFixed(1);
    await fs.writeFile(compreeedFilePath, compressedBuffer);
    return {
      ...image,
      status: EImageStatus.SUCCESS,
      compreeedFilePath,
      compreeedFileSize,
      compressedRatio,
    };
  });
  const result = Promise.all(imageCompressPromises);
  return result;
};
