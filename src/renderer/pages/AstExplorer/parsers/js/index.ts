import { Category } from '../../types/index';
import { babel } from './babel';
import { typescript } from './typescript';
import { acorn } from './acorn';
import { typescriptOfficial } from './typescript-official';
import { babelTransformer } from './transformers/babel';

export const javascript: Category = {
  id: 'javascript',
  displayName: 'JavaScript',
  parsers: [babel, typescript, typescriptOfficial, acorn],
  transformers: [babelTransformer],
  codeExample: `
function tips() {
  const tips = [
    "Click on any AST node with a '+' to expand it",
    "Hovering over a node highlights the corresponding part in the source code",
    "Shift click on an AST node to expand the whole subtree",
  ];
  tips.forEach((tip, i) => console.log(\`Tip \${i}:\`, tip));
}`,
};
