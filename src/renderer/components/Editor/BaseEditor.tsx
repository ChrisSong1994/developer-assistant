import { MedicineBoxOutlined } from '@ant-design/icons';
import { cx } from '@emotion/css';
import MonacoEditor from '@monaco-editor/react';

import { isEmpty } from '@/utils';
import Events from '@/utils/events';
import { DEFAULT_OPTIONS, EEditorLanguage } from './index';
import styles from './index.less';
export interface IBaseEditorProps {
  language?: EEditorLanguage;
  value?: string;
  onChange?: (v: any) => void;
  style?: Record<string, any>;
  options?: Record<string, any>;
  onMount?: (editor: any, monaco: any) => void;
  beforeMount?: (monaco: any) => void;
  onImport?: () => Promise<string | null>;
  tipShow?: boolean;
}

const BaseEditor = (props: IBaseEditorProps) => {
  const {
    language = EEditorLanguage.PLAINTEXT,
    value = '',
    onChange = () => {},
    style = {},
    options = {},
    onMount = () => {},
    beforeMount = () => {},
    onImport,
    tipShow = false,
  } = props;

  // 导入文件
  const handleImport = async () => {
    let fileValue: string | null = null;
    if (onImport) {
      fileValue = await onImport();
    } else {
      fileValue = await Events.getFileFromLocalPath();
    }
    if (fileValue) onChange(fileValue);
  };

  return (
    <div className={styles['editor-wrap']} style={style}>
      {isEmpty(value) && tipShow ? (
        <div className={cx(styles['editor-empty'], styles['editor-empty-tip'])} onClick={handleImport}>
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
