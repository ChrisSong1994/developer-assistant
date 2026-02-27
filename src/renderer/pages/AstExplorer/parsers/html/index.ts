import { Category } from '../../types';
import { htmlparser2Parser } from './htmlparser2';
import { parse5Parser } from './parse5';

export const html: Category = {
  id: 'html',
  displayName: 'HTML',
  parsers: [htmlparser2Parser, parse5Parser],
  codeExample: `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`,
};
