import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';
import AceEditor from 'react-ace';

interface IProps {
  style: Record<string, any>;
  value: string;
  onChange: (v: any) => void;
}

const JsonEditor = (props: IProps) => {
  const { style = {}, value, onChange } = props;

  return (
    <AceEditor
      placeholder="请输入 json 数据..."
      mode="json"
      theme="chrome"
      name="json"
      style={{
        width: '100%',
        border: '1px solid #E9E9E9',
        ...style,
      }}
      fontSize={16}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 4,
      }}
      value={value}
      onChange={onChange}
    />
  );
};

export default JsonEditor;
