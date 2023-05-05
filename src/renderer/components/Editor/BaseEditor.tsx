import MonacoEditor from '@monaco-editor/react';
import { DEFAULT_OPTIONS, EEditorLanguage } from './index';

interface IProps {
  language?: EEditorLanguage;
  value?: string;
  onChange?: (v: any) => void;
  style?: Record<string, any>;
  options?: Record<string, any>;
  onMount?: (editor: any, monaco: any) => void;
  beforeMount?: (monaco: any) => void;
}

const BaseEditor = (props: IProps) => {
  const {
    language = EEditorLanguage.PLAINTEXT,
    value = '',
    onChange = () => {},
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
      <MonacoEditor
        theme="light"
        language={language}
        height="100%"
        options={{
          ...DEFAULT_OPTIONS,
          ...options,
        }}
        value={value}
        onChange={onChange}
        onMount={onMount}
        beforeMount={beforeMount}
      />
    </div>
  );
};

export default BaseEditor;
