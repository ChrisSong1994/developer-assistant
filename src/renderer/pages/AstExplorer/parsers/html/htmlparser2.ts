import * as htmlparser2 from 'htmlparser2';
import { defaultParserInterface } from '../utils';

export const htmlparser2Parser = {
  ...defaultParserInterface,
  id: 'htmlparser2',
  displayName: 'htmlparser2',
  version: '10.x',
  homepage: 'https://github.com/fb55/htmlparser2',

  loadParser(callback?: (parser: any) => void) {
    if (callback) callback(htmlparser2);
    return Promise.resolve(htmlparser2);
  },

  parse(parser: any, code: string) {
    const mod = parser?.parseDocument ? parser : parser?.default ?? parser;
    return mod.parseDocument(code);
  },
};
