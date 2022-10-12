const { ipcMain, app } = require('electron');
import { generateKey } from '../services';

// 同步通信
ipcMain.on('synchronous-message', (event, data) => {
  console.log('synchronous-message', event, data);
  const { action } = data;

  // 获取appPath
  if (action === 'getAppPath') {
    event.returnValue = app.getAppPath();
  }
});

// 异步通信
ipcMain.handle('asynchronous-message', async (event, data) => {
  console.log('asynchronous-message', event, data);
  const { action, params } = data;
  let result = null;

  switch (action) {
    case 'generateKey':
      result = await generateKey(params);
      break;
  }

  return result;
});
