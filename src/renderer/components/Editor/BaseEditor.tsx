import { MedicineBoxOutlined } from '@ant-design/icons';
import { cx } from '@emotion/css';
import MonacoEditor from '@monaco-editor/react';
import _ from 'lodash';
import { memo } from 'react';

import { isEmpty } from '@/renderer/utils';
import Events from '@/renderer/utils/events';
import { DEFAULT_OPTIONS, EEditorLanguage } from './index';
import styles from './index.module.less';
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
  const handleFileImport = async () => {
    let fileValue: string | null = null;
    if (onImport) {
      fileValue = await onImport();
    } else {
      const res = await Events.getFileFromLocalPath();
      fileValue = res.fileValue;
    }
    if (fileValue) onChange(fileValue);
  };

  const handleFileDrop = async (event: any) => {
    event.stopPropagation();
    const file = _.get(event, 'dataTransfer.files[0');
    if (file?.path) {
      const fileValue = await Events.getFileFromPath({ filePath: file.path });
      if (fileValue) onChange(fileValue);
    }
  };

  return (
    <div className={styles['editor-wrap']} style={style} onDrop={handleFileDrop}>
      {isEmpty(value) && tipShow ? (
        <div className={cx(styles['editor-empty'], styles['editor-empty-tip'])} onClick={handleFileImport}>
          <MedicineBoxOutlined className={styles['add-file']} />
          <span>请输入文本信息或点击图标导入文本文件</span>
        </div>
      ) : null}
      <MonacoEditor
        theme="light"
        language={language}
        height="100%"
        loading={null}
        options={{
          ...DEFAULT_OPTIONS,
          ...options,
        }}
        value={value}
        onChange={_.debounce(onChange, 300)}
        onMount={onMount}
        beforeMount={beforeMount}
      />
    </div>
  );
};

export default memo(BaseEditor);
