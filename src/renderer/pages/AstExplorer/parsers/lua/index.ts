import { Category } from '../../types';
import { luaparseParser } from './luaparse';

export const lua: Category = {
  id: 'lua',
  displayName: 'Lua',
  parsers: [luaparseParser],
  codeExample: `
print("Hello World!")
`,
};
