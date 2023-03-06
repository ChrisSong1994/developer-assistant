import AceEditor from './AceEditor';

interface IProps {
  style: Record<string, any>;
  value: string;
  onChange: (v: any) => void;
}

const YamlEditor = (props: IProps) => {
  const { style = {}, value, onChange } = props;

  return (
    <AceEditor
      placeholder="请输入 yaml 数据..."
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

export default YamlEditor;
