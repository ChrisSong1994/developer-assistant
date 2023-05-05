import BaseEditor from './BaseEditor';
import { EEditorLanguage } from './index';

interface IProps {
  value: string;
  onChange: (v: any) => void;
  style?: Record<string, any>;
}

const JsonEditor = (props: IProps) => {
  const { value, onChange, style } = props;

  const handleEditorMount = (monaco: any) => {
    // 关闭json 自带语法校验 ？？？
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: false,
    });
  };

  return (
    <BaseEditor
      style={style}
      language={EEditorLanguage.JSON}
      value={value}
      onChange={onChange}
      beforeMount={handleEditorMount}
    />
  );
};

export default JsonEditor;
