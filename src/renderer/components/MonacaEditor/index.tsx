import MonacoEditor, { DiffEditor, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import monacoEditorWorker from 'monaco-editor/esm/vs/editor/editor.worker';
import monacoCssWorker from 'monaco-editor/esm/vs/language/css/css.worker';
import monacoHtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker';
import monacoJsonWorker from 'monaco-editor/esm/vs/language/json/json.worker';
import monacoTsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker';

self.MonacoEnvironment = {
  getWorker: function (_, label) {
    switch (label) {
      case 'json':
        return new monacoJsonWorker();
      case 'css':
      case 'scss':
      case 'less':
        return new monacoCssWorker();
      case 'html':
      case 'handlebars':
      case 'razor':
        return new monacoHtmlWorker();
      case 'typescript':
      case 'javascript':
        return new monacoTsWorker();
      default:
        return new monacoEditorWorker();
    }
  },
};
loader.config({ monaco });
export { MonacoEditor, DiffEditor };
