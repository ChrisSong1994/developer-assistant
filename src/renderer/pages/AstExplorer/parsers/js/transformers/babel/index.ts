import * as babel from '@babel/standalone';

export const babelTransformer = {
  id: 'babel',
  displayName: 'Babel',
  version: '7.x',
  homepage: 'https://babeljs.io',
  defaultTransform: `export default function(babel) {
  const { types: t } = babel;
  
  return {
    name: "ast-transform", // not required
    visitor: {
      Identifier(path) {
        path.node.name = path.node.name.split('').reverse().join('');
      }
    }
  };
}`,
  
  loadTransformer(callback?: (transformer: any) => void) {
    if (callback) {
      callback(babel);
    }
    return Promise.resolve(babel);
  },

  transform(transformer: any, transformCode: string, code: string, options?: any) {
    // 1. Transpile the transform code itself (in case it uses ES6+)
    const transpiledTransformCode = transformer.transform(transformCode, {
      presets: ['env'],
    }).code;

    // 2. Evaluate the transform code to get the plugin function
    // We need to wrap it in a function to avoid global scope pollution and handle exports
    const getPlugin = new Function('module', 'exports', 'require', transpiledTransformCode);
    const module = { exports: {} };
    getPlugin(module, module.exports, null);
    const plugin = (module.exports as any).default || module.exports;

    // 3. Apply the plugin to the source code
    return transformer.transform(code, {
      plugins: [plugin],
      ...options,
    }).code;
  }
};
