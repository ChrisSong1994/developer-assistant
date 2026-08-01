import * as remark from 'remark';
import * as remarkParse from 'remark-parse';
import * as remarkGfm from 'remark-gfm';
import { defaultParserInterface } from '../utils';

export const remarkParser = {
  ...defaultParserInterface,
  id: 'remark',
  displayName: 'remark',
  version: '14.x',
  homepage: 'https://remark.js.org',

  loadParser(callback?: (parser: any) => void) {
    const parser = { remark, remarkParse, remarkGfm };
    if (callback) callback(parser);
    return Promise.resolve(parser);
  },

  parse(parser: any, code: string) {
    const { remark, remarkParse, remarkGfm } = parser;
    const createRemark = remark?.remark ?? remark?.default ?? remark;
    const parsePlugin = remarkParse?.default ?? remarkParse;
    const gfmPlugin = remarkGfm?.default ?? remarkGfm;
    const processor = createRemark().use(parsePlugin).use(gfmPlugin);
    return processor.parse(code);
  },
};
