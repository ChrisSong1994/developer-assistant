import { Category } from '../../types';
import { babel } from './babel';
import { babelTransformer } from './transformers/babel';

export const javascript: Category = {
  id: 'javascript',
  displayName: 'JavaScript',
  parsers: [babel],
  transformers: [babelTransformer],
};
