import { dialog, OpenDialogOptions } from 'electron';
import fs from 'fs-extra';
import _ from 'lodash';

import { getFileFromPath } from '../utils/file';
import { getConfData } from '../store';

export const getFilePath = async (options: OpenDialogOptions = {}) => {
  const { downloadPath } = await getConfData();
  return dialog.showOpenDialog(global.mainWindow, {
    properties: ['openFile', 'openDirectory', 'createDirectory'],
    defaultPath: downloadPath,
    ...options,
  });
};

export const getSingleFilePath = async (options: OpenDialogOptions = {}) => {
  const { downloadPath } = await getConfData();
  const result = await dialog.showOpenDialog(global.mainWindow, {
    defaultPath: downloadPath,
    ...options,
    properties: ['openFile'],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths[0];
};

export const getSingleDirPath = async (options: OpenDialogOptions = {}) => {
  const { downloadPath } = await getConfData();
  const result = await dialog.showOpenDialog(global.mainWindow, {
    defaultPath: downloadPath,
    ...options,
    properties: ['openDirectory'],
  });
  if (result.canceled) {
    return null;
  }
  return result.filePaths[0];
};

export const saveFileToLocal = async (options: OpenDialogOptions & { fileName: string; payload: string }) => {
  const { downloadPath } = await getConfData();
  const result = await dialog.showSaveDialog(global.mainWindow, {
    ..._.omit(options, ['defaultPath', 'fileName']),
    defaultPath: options.defaultPath || `${downloadPath}/${options.fileName}`,
    properties: ['createDirectory', 'showOverwriteConfirmation'],
  });
  if (!result.canceled && result.filePath) {
    await fs.writeFile(result.filePath, options.payload, { encoding: 'utf8' });
  }
};

export const getFileFromLocalPath = async (options: OpenDialogOptions & { encoding?: BufferEncoding } = {}) => {
  const filePath = await getSingleFilePath(options);
  if (filePath) {
    const fileValue = await getFileFromPath({ filePath, encoding: options.encoding });
    return { fileValue, filePath };
  }
  return { fileValue: null, filePath };
};
