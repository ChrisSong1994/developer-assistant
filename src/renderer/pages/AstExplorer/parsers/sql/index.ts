import { Category } from '../../types';
import { sqlCstParser } from './sql-parser-cst';

export const sql: Category = {
  id: 'sql',
  displayName: 'SQL',
  parsers: [sqlCstParser],
  codeExample: `
SELECT * FROM users WHERE id = 1;
`,
};
