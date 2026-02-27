
import { Parser } from '../../types';
import { importUrl } from '../utils/loader';

export const lightningcss: Parser = {
  id: 'lightningcss',
  displayName: 'Lightning CSS',
  homepage: 'https://lightningcss.dev/',
  loadParser: async (callback) => {
    // Using esm.sh for lightningcss-wasm
    const mod = await importUrl('https://esm.sh/lightningcss-wasm');
    await mod.default(); // Initialize WASM
    if (callback) callback(mod);
    return mod;
  },
  parse(lightningcss, code, options) {
    const encoder = new TextEncoder();
    let result: any;
    // We use transform with a visitor to extract the stylesheet AST
    lightningcss.transform({
      filename: 'input.css',
      ...options,
      code: encoder.encode(code),
      visitor: {
        StyleSheet(stylesheet: any) {
          result = stylesheet;
        },
      },
    });
    return result;
  },
  getDefaultOptions() {
    return {
      filename: 'input.css',
    };
  },
};
