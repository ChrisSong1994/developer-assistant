import { MedicineBoxOutlined } from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';

import { isEmpty } from '@/utils';
import Events from '@/utils/events';
import { DEFAULT_OPTIONS, EEditorLanguage } from './index';
import styles from './index.less';
interface IProps {
  language?: EEditorLanguage;
  value?: string;
  onChange?: (v: any) => void;
  style?: Record<string, any>;
  options?: Record<string, any>;
  onMount?: (editor: any, monaco: any) => void;
  beforeMount?: (monaco: any) => void;
  tipShow?: boolean;
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
    tipShow = false,
  } = props;

  // 导入文件
  const handleImport = async () => {
    const fileValue = await Events.getFileFromLocalPath({ filters: [{ name: 'json文件', extensions: ['*.json'] }] });
    if (fileValue) onChange(fileValue);
  };

  return (
    <div className={styles['editor-wrap']} style={style}>
      {isEmpty(value) && tipShow ? (
        <div className={styles['editor-empty-tip']} onClick={handleImport}>
          <MedicineBoxOutlined className={styles['add-file']} />
          <span>请输入文本信息或点击图标导入文本文件</span>
        </div>
      ) : null}
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
