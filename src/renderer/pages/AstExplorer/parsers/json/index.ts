import { Category } from '../../types';
import { jsonToAstParser } from './json-to-ast';

export const json: Category = {
  id: 'json',
  displayName: 'JSON',
  parsers: [jsonToAstParser],
  codeExample: `
{
  "key": "value",
  "array": [1, 2, 3],
  "nested": {
    "boolean": true
  }
}
`,
};
