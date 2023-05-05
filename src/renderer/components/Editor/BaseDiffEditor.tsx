import { DiffEditor } from '@monaco-editor/react';
import { DEFAULT_OPTIONS, EEditorLanguage } from './index';

interface IProps {
  language?: EEditorLanguage;
  original?: string;
  modified?: string;
  style?: Record<string, any>;
  options?: Record<string, any>;
  onMount?: (editor: any, monaco: any) => void;
  beforeMount?: (monaco: any) => void;
}

const BaseDiffEditor = (props: IProps) => {
  const {
    original = '',
    modified = '',
    language = EEditorLanguage.PLAINTEXT,
    style = {},
    options = {},
    onMount = () => {},
    beforeMount = () => {},
  } = props;

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
          originalEditable: true,
          ...DEFAULT_OPTIONS,
          ...options,
        }}
        original={original}
        modified={modified}
        onMount={onMount}
        beforeMount={beforeMount}
      />
    </div>
  );
};

export default BaseDiffEditor;
