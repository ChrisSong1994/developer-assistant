import * as javaParser from 'java-parser';
import { defaultParserInterface } from '../utils';

export const java = {
  ...defaultParserInterface,
  id: 'java-parser',
  displayName: 'java-parser',
  version: '2.x',
  homepage: 'https://github.com/jhipster/prettier-java',

  loadParser(callback?: (parser: any) => void) {
    if (callback) callback(javaParser);
    return Promise.resolve(javaParser);
  },

  parse(parser: any, code: string) {
    return parser.parse(code);
  },

  nodeToRange(node: any): [number, number] | undefined {
    if (node.location) {
      return [node.location.startOffset, node.location.endOffset + 1];
    }
  },
};
