import * as babelParser from '@babel/parser';
import { defaultESTreeParserInterface } from '../utils';

export const typescript = {
  ...defaultESTreeParserInterface,
  id: 'typescript',
  displayName: 'TypeScript (@babel/parser)',
  version: '7.x',
  homepage: 'https://babeljs.io/',

  loadParser(callback?: (parser: any) => void) {
    if (callback) callback(babelParser);
    return Promise.resolve(babelParser);
  },

  parse(parser: any, code: string, options: any) {
    return parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'classProperties', 'objectRestSpread', 'estree'],
      ...options,
    });
  },
};
