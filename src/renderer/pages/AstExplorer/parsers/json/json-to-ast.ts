import * as jsonToAst from 'json-to-ast';
import { defaultParserInterface } from '../utils';

export const jsonToAstParser = {
  ...defaultParserInterface,
  id: 'json-to-ast',
  displayName: 'json-to-ast',
  version: '2.x',
  homepage: 'https://github.com/vtrushin/json-to-ast',

  loadParser(callback?: (parser: any) => void) {
    if (callback) callback(jsonToAst);
    return Promise.resolve(jsonToAst);
  },

  parse(parser: any, code: string) {
    return parser(code);
  },
};
