import Events from '@/utils/events';
import BaseEditor from './BaseEditor';
import { EEditorLanguage } from './index';

interface IProps {
  value: string;
  onChange: (v: any) => void;
  style?: Record<string, any>;
}

const JsonEditor = (props: IProps) => {
  const { value, onChange, style } = props;

  const handleImport = async () => {
    const fileValue = await Events.getFileFromLocalPath({ filters: [{ name: 'json文件', extensions: ['*.json'] }] });
    return fileValue;
  };

  return (
    <BaseEditor
      style={style}
      language={EEditorLanguage.JSON}
      value={value}
      tipShow={true}
      onImport={handleImport}
      onChange={onChange}
      options={{ maxTokenizationLineLength: 5000, stopRenderingLineAfter: 5000 }} // 好像不生效？？
    />
  );
};

export default JsonEditor;
