import { default as ZH_CN } from './cn';
import { default as EN_US } from './en';

export const languages = {
  cn: ZH_CN,
  ZH_CN,
  en: EN_US,
  EN_US,
};

export type LanguageDict = typeof ZH_CN;
export type LocaleName = keyof typeof languages;
