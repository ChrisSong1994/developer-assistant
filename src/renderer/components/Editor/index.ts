import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
export enum EEditorLanguage {
  PLAINTEXT = 'plaintext',
  JSON = 'json',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  SCSS = 'scss',
  SQL = 'sql',
  JAVA = 'java',
  CSS = 'css',
  HTML = 'html',
  LESS = 'less',
  PHP = 'php',
  GO = 'go',
  SHELL = 'shell',
  RUBY = 'ruby',
  RUST = 'rust',
  PYTHON = 'python',
  YAML = 'yaml',
  XML = 'xml',
}

export const DEFAULT_OPTIONS = {
  acceptSuggestionOnError: false,
  contextmenu: false,
  fontSize: 14,
  lineDecorationsWidth: 4,
  lineNumbersMinChars: 4,
  automaticLayout: true,
  scrollBeyondLastLine: false, // 设置编辑器是否可以滚动到最后一行之后
  minimap: { enabled: false },
  folding: true, // 是否启用代码折叠
  wordWrap: 'on', // 默认自动换行
  quickSuggestions: false,
  renderValidationDecorations: "off",
  codeLens: false,
  maxTokenizationLineLength: 5000,
  unicodeHighlight: {
    ambiguousCharacters: false, // 关闭字符串内特殊字符高亮，为了性能
  },
} as Partial<editor.IEditorOptions>;

export { default as BaseDiffEditor } from './BaseDiffEditor';
export { default as BaseEditor } from './BaseEditor';
export { default as JsonEditor } from './JsonEditor';
export { default as YamlEditor } from './YamlEditor';
