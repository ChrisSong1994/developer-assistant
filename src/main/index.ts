import { app, BrowserWindow, protocol } from 'electron';
import createProtocol from 'umi-plugin-electron-builder/lib/createProtocol';
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import './utils/ipc';

const isDevelopment = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow;

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

// 创建渲染窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 2000,
    height: 1000,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      devTools: isDevelopment,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
    },
  });

  mainWindow.setWindowButtonVisibility(false); // 禁止显示信号灯

  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:8000');
  } else {
    createProtocol('app');
    mainWindow.loadURL('app://./index.html');
  }

  mainWindow.webContents.once('dom-ready', () => {
    // 打开devTool
    if (isDevelopment) {
      mainWindow.webContents.openDevTools();
    }
  });
}

app.on('ready', async () => {
  // 开发环境下安装插件
  if (isDevelopment) {
    await installExtension([REACT_DEVELOPER_TOOLS.id, REDUX_DEVTOOLS.id]);
  }
  createWindow();
});

// mac下关闭窗口回到dock不会关闭进程
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
