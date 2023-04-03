import { URL_PARAMS_KEYS } from '@/constants';
import _ from 'lodash';
import moment from 'moment';
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

// 生成日期id
export function generateDateUUID() {
  const uuid = moment().format('YYYYMMDDHHmmss');
  return uuid;
}

// 正则匹配
export const regMatch = (reg: RegExp, str: string) => {
  const result = reg.exec(str);
  return {
    matcheds: result ? str.match(reg) : null,
    index: result?.index,
  };
};

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
