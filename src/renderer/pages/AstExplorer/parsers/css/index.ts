import { Category } from '../../types';
import { postcssParser } from './postcss';
import { cssTree } from './css-tree';
import { lightningcss } from './lightningcss';

export const css: Category = {
  id: 'css',
  displayName: 'CSS',
  parsers: [postcssParser, cssTree, lightningcss],
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
