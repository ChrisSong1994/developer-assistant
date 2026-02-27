import { Category } from '../../types';
import { java as javaParser } from './java-parser';

export const java: Category = {
  id: 'java',
  displayName: 'Java',
  parsers: [javaParser],
  codeExample: `
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}
`,
};
