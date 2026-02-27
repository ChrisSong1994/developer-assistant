import { Category } from '../../types';
import { postcssParser } from './postcss';

export const css: Category = {
  id: 'css',
  displayName: 'CSS',
  parsers: [postcssParser],
  codeExample: `
.className {
  color: blue;
  background: red;
}

#id {
  font-size: 24px;
}
`,
};
