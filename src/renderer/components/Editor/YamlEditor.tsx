import Events from '@/utils/events';
import BaseEditor from './BaseEditor';
import { EEditorLanguage } from './index';

interface IProps {
  value: string;
  onChange: (v: any) => void;
  style?: Record<string, any>;
}

const YamlEditor = (props: IProps) => {
  const { value, onChange, style } = props;
  const handleImport = async () => {
    const fileValue = await Events.getFileFromLocalPath({
      filters: [{ name: 'yaml文件', extensions: ['*.yaml', '*.yml'] }],
    });
    return fileValue;
  };

  return (
    <BaseEditor
      style={style}
      language={EEditorLanguage.YAML}
      tipShow={true}
      onImport={handleImport}
      value={value}
      onChange={onChange}
    />
  );
};

export default YamlEditor;
