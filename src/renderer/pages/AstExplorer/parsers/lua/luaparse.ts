import * as luaparse from 'luaparse';
import { defaultParserInterface } from '../utils';

export const luaparseParser = {
  ...defaultParserInterface,
  id: 'luaparse',
  displayName: 'luaparse',
  version: '0.x',
  homepage: 'https://github.com/fstirlitz/luaparse',

  loadParser(callback?: (parser: any) => void) {
    if (callback) callback(luaparse);
    return Promise.resolve(luaparse);
  },

  parse(parser: any, code: string) {
    return parser.parse(code, {
      ranges: true,
      locations: true,
      comments: true,
      scope: true,
    });
  },

  nodeToRange(node: any) {
    return node.range;
  },
};
