import { Category } from '../../types';
import { graphqlParser } from './graphql';

export const graphql: Category = {
  id: 'graphql',
  displayName: 'GraphQL',
  parsers: [graphqlParser],
  codeExample: `
query {
  user(id: "1") {
    id
    name
    email
  }
}
`,
};
