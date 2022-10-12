import { fetchParentPath, fetchParentPathForWin } from './pathUtils';
const { app } = require('electron');

const APP_PATH = app.getAppPath();
const APP_PATH_MAC = fetchParentPath(APP_PATH);
const APP_PATH_WIN = fetchParentPathForWin(APP_PATH);
