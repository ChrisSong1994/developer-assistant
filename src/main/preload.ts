import { contextBridge } from 'electron';
import os from 'os';

import dispatch from '../main/dispatch';

const apiKey = 'electronBridge';

const api: any = {
  platform: os.platform(),
  versions: process.versions,
  dispatch: dispatch,
};

contextBridge.exposeInMainWorld(apiKey, api);
