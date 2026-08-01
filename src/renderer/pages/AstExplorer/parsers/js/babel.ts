import * as babelParser from '@babel/parser';
import { defaultESTreeParserInterface } from '../utils';

export const babel = {
  ...defaultESTreeParserInterface,
  id: 'babel',
  displayName: '@babel/parser',
  version: '7.x',
  homepage: 'https://babeljs.io/docs/en/babel-parser',

  loadParser(callback?: (parser: any) => void) {
    if (callback) {
      callback(babelParser);
    }
    return Promise.resolve(babelParser);
  },

  parse(parser: any, code: string, options: any) {
    return parser.parse(code, {
      sourceType: 'module',
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      plugins: [
        'asyncGenerators',
        'bigInt',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'decorators-legacy',
        'doExpressions',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'functionBind',
        'functionSent',
        'importMeta',
        'logicalAssignment',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'partialApplication',
        'throwExpressions',
        'topLevelAwait',
        'typescript',
        'jsx',
      ],
      ...options,
    });
  },

  nodeToRange(node: any): [number, number] | undefined {
    if (typeof node.start === 'number') {
      return [node.start, node.end];
    }
  },

  getNodeName(node: any) {
    switch (typeof node.type) {
      case 'string':
        return node.type;
      case 'object':
        return `Token (${node.type.label})`;
    }
  },
};
