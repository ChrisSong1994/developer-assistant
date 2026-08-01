
export default function compileModule(code: string, globals: any = {}) {
  const exports = {};
  const module = { exports };
  const globalNames = Object.keys(globals);
  const globalValues = globalNames.map((k) => globals[k]);
  const newCode = new Function('module', 'exports', ...globalNames, code);
  newCode(module, exports, ...globalValues);
  return module.exports;
}
