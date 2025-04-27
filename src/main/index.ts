import { app } from 'electron';
import { installDevtool } from './utils';

import eventsRegistry from './eventsRegistry';
import { dbRegistory } from './db';
import { windowInit } from './modules/windows';
import { isDev } from './utils';

export async function onReady() {
  // 创建主窗口
  windowInit();

  // 事件消息
  eventsRegistry();

  // 数据初始化
  await dbRegistory();

  // 加载开发插件
  if (isDev) {
    await installDevtool();
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
