import * as filbert from 'filbert';
import { defaultParserInterface } from '../utils';

export const filbertParser = {
  ...defaultParserInterface,
  id: 'filbert',
  displayName: 'filbert',
  version: '0.x',
  homepage: 'https://github.com/differentmatt/filbert',

  loadParser(callback?: (parser: any) => void) {
    if (callback) callback(filbert);
    return Promise.resolve(filbert);
  },

  parse(parser: any, code: string) {
    return parser.parse(code, {
      locations: true,
      ranges: true,
    });
  },

  nodeToRange(node: any) {
    return node.range;
  },
};
