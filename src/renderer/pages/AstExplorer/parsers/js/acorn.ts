
import { Parser } from '../../types';
import { importJsdelivr } from '../utils/loader';
import { getNodeLocation } from '../utils/location';

export const acorn: Parser = {
  id: 'acorn',
  displayName: 'acorn',
  homepage: 'https://github.com/acornjs/acorn',
  loadParser: async (callback) => {
    const acorn = await importJsdelivr('acorn', '/dist/acorn.mjs');
    if (callback) callback(acorn);
    return acorn;
  },
  parse(acorn, code, options) {
    const comments: any[] = [];
    const tokens: any[] = [];
    
    const ast = acorn.parse(code, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      locations: true,
      ranges: true,
      ...options,
      onComment: comments,
      onToken: tokens,
    });

    if (comments.length > 0) {
      ast.comments = comments;
    }
    if (tokens.length > 0) {
      ast.tokens = tokens;
    }

    return ast;
  },
  nodeToRange: getNodeLocation,
  getDefaultOptions() {
    return {
      ecmaVersion: 'latest',
      sourceType: 'module',
    };
  },
};
