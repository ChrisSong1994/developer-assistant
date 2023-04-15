import { dialog, OpenDialogOptions } from 'electron';

export const getFilePath = async (options: OpenDialogOptions) => {
  return dialog.showOpenDialog(global.mainWindow, {
    properties: ['openFile', 'openDirectory', 'createDirectory'],
    ...options,
  });
};

export const getSingleFilePath = async (options: OpenDialogOptions) => {
  const result = await dialog.showOpenDialog(global.mainWindow, {
    ...options,
    properties: ['openFile'],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths[0];
};

export const getSingleDirPath = async (options: OpenDialogOptions) => {
  const result = await dialog.showOpenDialog(global.mainWindow, {
    ...options,
    properties: ['openDirectory'],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths[0];
};
