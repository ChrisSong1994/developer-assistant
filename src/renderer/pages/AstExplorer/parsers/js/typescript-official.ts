
import { Parser } from '../../types';
import { importJsdelivr } from '../utils/loader';

export const typescriptOfficial: Parser = {
  id: 'typescript-official',
  displayName: 'TypeScript (Official)',
  homepage: 'https://www.typescriptlang.org/',
  loadParser: async (callback) => {
    const ts = await importJsdelivr('typescript', '/lib/typescript.js');
    if (callback) callback(ts);
    return ts;
  },
  parse(ts, code, options) {
    // scriptKind 3 is TS
    const { scriptKind = 3, ...rest } = options || {};
    return ts.createSourceFile('foo.ts', code, rest, true, scriptKind);
  },
  nodeToRange(node: any): [number, number] | undefined {
    if (!node || typeof node !== 'object') return;
    if (typeof node.getStart === 'function' && typeof node.getEnd === 'function') {
      return [node.getStart(), node.getEnd()];
    } else if (node.pos !== undefined && node.end !== undefined) {
      return [node.pos, node.end];
    }
  },
  getDefaultOptions() {
    return {
      languageVersion: 99, // Latest
      scriptKind: 3, // TS
    };
  },
  getNodeName(node: any) {
    // We can't easily get syntax kind name without the TS instance here easily unless we store it.
    // But for now let's just return node.kind (number) or if we can access TS instance.
    // The original code uses `this` context which is the parser module instance.
    // My `getNodeName` only receives `node`.
    // So I can't implement `getSyntaxKind` easily without global access to TS instance.
    // I'll skip complex naming for now or try to attach it during parse?
    return `Node (${node.kind})`;
  },
  _ignoredProperties: new Set(['parent', 'checker']),
};
