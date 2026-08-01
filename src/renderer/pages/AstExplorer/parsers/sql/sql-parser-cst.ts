import * as sqlParserCst from 'sql-parser-cst';
import { defaultParserInterface } from '../utils';

export const sqlCstParser = {
  ...defaultParserInterface,
  id: 'sql-parser-cst',
  displayName: 'sql-parser-cst',
  version: '0.x',
  homepage: 'https://github.com/nene/sql-parser-cst',

  loadParser(callback?: (parser: any) => void) {
    if (callback) callback(sqlParserCst);
    return Promise.resolve(sqlParserCst);
  },

  parse(parser: any, code: string, options: any) {
    return parser.parse(code, {
      dialect: 'sqlite',
      ...options,
    });
  },

  nodeToRange(node: any) {
    return node.range;
  },
};
