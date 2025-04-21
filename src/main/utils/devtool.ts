import { session } from 'electron';
import path from 'path';
import os from 'os';

export const installDevtool = async () => {
  const extendsionPath = path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions');
  const reactDevToolsPath = path.join(extendsionPath, '/fmkadmapgofadopljbjfkapdkoienihi/6.1.1_0');
  const reduxDevToolsPath = path.join(extendsionPath, '/lmhkpmbekcpmknklioeibfkpmmfibljd/3.2.7_0');
  await session.defaultSession.loadExtension(reactDevToolsPath);
  await session.defaultSession.loadExtension(reduxDevToolsPath);
};
