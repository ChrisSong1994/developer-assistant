import * as graphql from 'graphql';
import { defaultParserInterface } from '../utils';

export const graphqlParser = {
  ...defaultParserInterface,
  id: 'graphql-js',
  displayName: 'graphql-js',
  version: '16.x',
  homepage: 'https://github.com/graphql/graphql-js',

  loadParser(callback?: (parser: any) => void) {
    if (callback) callback(graphql);
    return Promise.resolve(graphql);
  },

  parse(parser: any, code: string) {
    return parser.parse(code);
  },
};
