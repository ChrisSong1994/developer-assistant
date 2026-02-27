import * as yaml from 'yaml';
import * as yamlAstParser from 'yaml-ast-parser';
import { defaultParserInterface } from '../utils';

export const yamlParser = {
  ...defaultParserInterface,
  id: 'yaml',
  displayName: 'yaml',
  version: '2.x',
  homepage: 'https://github.com/eemeli/yaml',

  loadParser(callback?: (parser: any) => void) {
    const parser = { yaml, yamlAstParser };
    if (callback) callback(parser);
    return Promise.resolve(parser);
  },

  parse(parser: any, code: string) {
    return parser.yaml.parseDocument(code);
  },
};

export const yamlAstParserParser = {
  ...defaultParserInterface,
  id: 'yaml-ast-parser',
  displayName: 'yaml-ast-parser',
  version: '0.0.43',
  homepage: 'https://github.com/mulesoft-labs/yaml-ast-parser',

  loadParser(callback?: (parser: any) => void) {
    const parser = { yaml, yamlAstParser };
    if (callback) callback(parser);
    return Promise.resolve(parser);
  },

  parse(parser: any, code: string) {
    return parser.yamlAstParser.load(code);
  },
};
