import _ from 'lodash';
import os from 'os';
/**
 * promise 结果转数组
 */
export function to(promise: Promise<any[]>) {
  return new Promise((resolve) => {
    promise.then(
      (res) => resolve([res, null]),
      (err) => resolve([null, err]),
    );
  });
}

// 判断是否是在win中
export function isInWin() {
  return os.platform() === 'win32';
}

// 是否是在mac
export function isInMac() {
  return os.platform() === 'darwin';
}

// 判断一个值是不是空值、undefined、null、空字符串等；
export const isEmpty = (value: any) => {
  if (typeof value === 'string') {
    return value === '';
  }

  if (_.isObject(value)) {
    return _.isEmpty(value);
  }

  return value === undefined || value === null;
};

// 感觉需要废弃掉了 参考下 jsonlint-mod的代码
export const jsonParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (err: any) {
    const result = /\d*$/.exec(err.message);
    if (!result) throw err;
    const position = Number(result[0]);
    const stringLineSplitArr = value.split('\n').map((str) => str.length);
    let line = 0;
    let column = 0;
    let index = 0;
    while (index + stringLineSplitArr[line] <= position) {
      index += stringLineSplitArr[line];
      line += 1;
    }
    column = position - index;
    const message = err.message.replace(`position ${position}`, `line ${line + 1} column ${column}`);
    throw new Error(message);
  }
};
