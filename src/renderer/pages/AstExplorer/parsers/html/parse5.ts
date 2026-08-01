import * as parse5 from 'parse5';
import { defaultParserInterface } from '../utils';

export const parse5Parser = {
  ...defaultParserInterface,
  id: 'parse5',
  displayName: 'parse5',
  version: '7.x',
  homepage: 'https://github.com/inikulin/parse5',

  loadParser(callback?: (parser: any) => void) {
    if (callback) callback(parse5);
    return Promise.resolve(parse5);
  },

  parse(parser: any, code: string) {
    return parser.parse(code);
  },
};
