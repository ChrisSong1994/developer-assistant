import { Category } from '../../types';
import { filbertParser } from './filbert';

export const python: Category = {
  id: 'python',
  displayName: 'Python',
  parsers: [filbertParser],
  codeExample: `
def hello():
    print("Hello, World!")
`,
};
