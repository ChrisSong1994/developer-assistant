import MonacoEditor from '@monaco-editor/react';
import { DEFAULT_OPTIONS, EEditorLanguage } from './index';

interface IProps {
  language?: EEditorLanguage;
  value?: string;
  onChange?: (v: any) => void;
  style?: Record<string, any>;
}

const BaseEditor = (props: IProps) => {
  const { language = EEditorLanguage.PLAINTEXT, value = '', onChange = () => {}, style = {} } = props;

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
        }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default BaseEditor;
