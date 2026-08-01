
import { Parser } from '../../types';
import { importJsdelivr } from '../utils/loader';
import { genGetNodeLocation } from '../utils/location';

export const cssTree: Parser = {
  id: 'csstree',
  displayName: 'csstree',
  homepage: 'https://github.com/csstree/csstree',
  loadParser: async (callback) => {
    const csstree = await importJsdelivr('css-tree', '/dist/csstree.esm.js');
    if (callback) callback(csstree);
    return csstree;
  },
  parse(csstree, code, options) {
    return csstree.parse(code, { positions: true, ...options });
  },
  nodeToRange: genGetNodeLocation('locOffset'),
  getDefaultOptions() {
    return {
      positions: true,
    };
  },
};
