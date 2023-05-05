import BaseEditor from './BaseEditor';
import { EEditorLanguage } from './index';

interface IProps {
  value: string;
  onChange: (v: any) => void;
  style?: Record<string, any>;
}

const JsonEditor = (props: IProps) => {
  const { value, onChange, style } = props;

  return (
    <BaseEditor
      style={style}
      language={EEditorLanguage.JSON}
      value={value}
      tipShow={true}
      onChange={onChange}
      options={{ maxTokenizationLineLength: 5000, stopRenderingLineAfter: 5000 }} // 好像不生效？？
    />
  );
};

export default JsonEditor;
