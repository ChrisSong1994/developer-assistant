import * as syn from 'astexplorer-syn';
import { defaultParserInterface } from '../utils';

export const synParser = {
  ...defaultParserInterface,
  id: 'syn',
  displayName: 'syn',
  version: '2.x',
  homepage: 'https://github.com/dtolnay/syn',
  _lineOffsets: [] as number[],

  loadParser(callback?: (parser: any) => void) {
    const mod = syn as any;
    const init = mod?.default;
    const promise = (async () => {
      if (typeof init === 'function') {
        await init();
      }
      return mod;
    })();
    if (callback) {
      promise.then(callback);
    }
    return promise;
  },

  parse(parser: any, code: string) {
    (this as any)._lineOffsets = [];
    let index = 0;
    do {
      (this as any)._lineOffsets.push(index);
    } while ((index = code.indexOf('\n', index) + 1) && index > 0);

    const mod = parser?.parseFile ? parser : parser?.default ?? parser;
    return mod.parseFile(code);
  },

  nodeToRange(node: any): [number, number] | undefined {
    if (node.span) {
      const offsets = (this as any)._lineOffsets;
      const start = node.span.start;
      const end = node.span.end;
      if (start && end && offsets) {
        return [
          offsets[start.line - 1] + start.column,
          offsets[end.line - 1] + end.column
        ];
      }
    }
    return undefined;
  },
};
