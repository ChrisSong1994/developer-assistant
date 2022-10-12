import childProcess from 'child_process';
import util from 'util';
import log from 'electron-log';

import { isInWin, to } from '../utils';

const exec = util.promisify(childProcess.exec);

/**
 * 生成密钥对
 * @param {string} pkcs 密钥格式
 * @param {string} rsaType 密钥长度
 * */
export async function generateKey({ pkcs, rsaType }: Record<string, string>) {}
