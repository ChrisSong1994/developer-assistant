import { Category } from '../../types';
import { remarkParser } from './remark';

export const markdown: Category = {
  id: 'markdown',
  displayName: 'Markdown',
  parsers: [remarkParser],
  codeExample: `
# Hello World

This is a **markdown** example.

- List item 1
- List item 2
`,
};
