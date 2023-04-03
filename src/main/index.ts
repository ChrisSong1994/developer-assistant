import { app, BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

import eventsRegister from './eventsRegister';
import { dbInit } from './modules/data';
import { getOrCreateMainWindow } from './modules/windows';

const isDevelopment = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow;

export async function onReady() {
  // 创建主窗口
  mainWindow = getOrCreateMainWindow();

  // 事件注册
  eventsRegister(mainWindow);

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
    getOrCreateMainWindow();
  } else {
    mainWindow.show();
  }
});
