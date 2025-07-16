import _ from 'lodash';
import { URL_PARAMS_KEYS } from '@/renderer/constants';

// 转换 url 实例为对象
export const urlConverToObject = (url: URL) => {
  const result: Record<string, any> = {};
  if (!url) return result;
  for (let key of URL_PARAMS_KEYS) {
    // @ts-ignore
    const value = url[key];
    if (value) {
      if (key === 'searchParams') {
        const params: Record<string, any> = {};
        value.forEach((v: string, k: string) => {
          Reflect.set(params, k, v);
        });
        Reflect.set(result, key, params);
      } else if (key === 'protocol') {
        Reflect.set(result, key, value.slice(0, -1));
      } else {
        Reflect.set(result, key, value);
      }
    }
  }
  return result;
};

// 获取文件扩展名
export const getFilePathExt = (filePath: string) => {
  const splits = filePath.split('.');
  const ext = splits.pop();
  return ext;
};

// 数组对象去重
export const arrayObjDeWightByKey = (data: Array<Record<string, any>>, key: string) => {
  if (!data.length) return data;
  const map = new Map();
  for (let item of data) {
    if (!map.has(item[key])) {
      map.set(item[key], item);
    }
  }
  return Array.from(map.values());
};

// 文件大小单位
export function formatFileSize(size: number) {
  const units = new Array('Bytes', 'KB', 'MB', 'GB');
  const unit = Math.floor(Math.log(size) / Math.log(1000));
  const output = `${(size / Math.pow(1000, unit)).toFixed(2)} ${units[unit]}`;
  return output;
}
