import * as postcss from 'postcss';
import * as postcssLess from 'postcss-less';
import * as postcssScss from 'postcss-scss';
import { defaultParserInterface } from '../utils';

export const postcssParser = {
  ...defaultParserInterface,
  id: 'postcss',
  displayName: 'PostCSS',
  version: '8.x',
  homepage: 'https://postcss.org/',

  loadParser(callback?: (parser: any) => void) {
    const parser = { postcss, postcssLess, postcssScss };
    if (callback) callback(parser);
    return Promise.resolve(parser);
  },

  parse(parser: any, code: string, options: any) {
    let parseFn = parser.postcss.parse;
    if (options?.syntax === 'less') {
      parseFn = parser.postcssLess.parse;
    } else if (options?.syntax === 'scss') {
      parseFn = parser.postcssScss.parse;
    }
    return parseFn(code);
  },

  getDefaultOptions() {
    return {
      syntax: 'css',
    };
  },
};
