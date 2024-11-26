import { app } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

import eventsRegistry from './eventsRegistry';
import { dbInit } from './modules/data';
import { windowInit } from './modules/windows';
import { isDevelopment } from './utils';

export async function onReady() {
  // 创建主窗口
  windowInit();

  // 事件消息
  eventsRegistry();

  // 数据初始化
  await dbInit();

  // 加载开发插件
  if (isDevelopment) {
    await installExtension([REACT_DEVELOPER_TOOLS.id, REDUX_DEVTOOLS.id]);
  }
}

app.whenReady().then(onReady);

// mac下关闭窗口回到dock不会关闭进程
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    windowInit();
  } else {
    globalThis.launchWindow.hide();
    globalThis.mainWindow.show();
  }
});
