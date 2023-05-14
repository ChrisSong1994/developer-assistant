import { shell } from 'electron';

export const openUrl = ({ url }: { url: string }) => shell.openExternal(url);

export const showItemInFolder = ({ path }: { path: string }) => shell.showItemInFolder(path);
