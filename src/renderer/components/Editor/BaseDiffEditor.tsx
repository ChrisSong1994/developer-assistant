import { DiffEditor } from '@monaco-editor/react';
import { DEFAULT_OPTIONS, EEditorLanguage } from './index';

interface IProps {
  language?: EEditorLanguage;
  original?: string;
  modified?: string;
  style?: Record<string, any>;
}

const BaseDiffEditor = (props: IProps) => {
  const { original = '', modified = '', language = EEditorLanguage.PLAINTEXT, style = {} } = props;

  return (
    <div
      style={{
        overflow: 'hidden',
        border: '1px solid #dadce0',
        borderRadius: 4,
        height: '100%',
        ...style,
      }}
    >
      <DiffEditor
        theme="light"
        language={language}
        height={'100%'}
        options={{
          ...DEFAULT_OPTIONS,
          originalEditable: true,
        }}
        original={original}
        modified={modified}
      />{' '}
    </div>
  );
};

export default BaseDiffEditor;
