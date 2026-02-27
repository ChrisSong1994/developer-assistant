import { Category } from '../../types';
import { synParser } from './syn';

export const rust: Category = {
  id: 'rust',
  displayName: 'Rust',
  parsers: [synParser],
  codeExample: `
fn main() {
    println!("Hello, world!");
}
`,
};
