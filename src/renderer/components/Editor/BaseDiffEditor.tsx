import { MedicineBoxOutlined } from '@ant-design/icons';
import { cx } from '@emotion/css';
import { DiffEditor, Monaco } from '@monaco-editor/react';

import { useUpdate } from '@/hooks';
import { isEmpty } from '@/utils';
import Events from '@/utils/events';
import { useRef } from 'react';
import { DEFAULT_OPTIONS, EEditorLanguage } from './index';
import styles from './index.less';
interface IDiffEditorProps {
  language?: EEditorLanguage;
  style?: Record<string, any>;
  options?: Record<string, any>;
  tipShow?: boolean;
}

const BaseDiffEditor = (props: IDiffEditorProps) => {
  const { language = EEditorLanguage.PLAINTEXT, style = {}, options = {}, tipShow = false } = props;
  const update = useUpdate();
  const originalValueRef = useRef<string>('');
  const modifiedValueRef = useRef<string>('');

  function handleEditorMount(editor: any, _monaco: Monaco) {
    const modifiedEditor = editor.getModifiedEditor();
    const originalEditor = editor.getOriginalEditor();
    modifiedEditor.onDidChangeModelContent(() => {
      const newModifedValue = modifiedEditor.getValue();
      if (isEmpty(modifiedValueRef.current) || isEmpty(newModifedValue)) {
        modifiedValueRef.current = newModifedValue;
        update();
      }
    });
    originalEditor.onDidChangeModelContent(() => {
      const newOriginalValue = originalEditor.getValue();
      if (isEmpty(originalValueRef.current) || isEmpty(newOriginalValue)) {
        originalValueRef.current = newOriginalValue;
        update();
      }
    });
  }

  const handleOriginalImport = async () => {
    const fileValue = await Events.getFileFromLocalPath();
    if (fileValue) {
      originalValueRef.current = fileValue;
      update();
    }
  };

  const handleModifiedImport = async () => {
    const fileValue = await Events.getFileFromLocalPath();
    if (fileValue) {
      modifiedValueRef.current = fileValue;
      update();
    }
  };

  return (
    <div className={styles['editor-wrap']} style={style}>
      {isEmpty(originalValueRef.current) && tipShow ? (
        <div className={cx(styles['editor-empty-tip'], styles['editor-empty-left'])} onClick={handleOriginalImport}>
          <MedicineBoxOutlined className={styles['add-file']} />
          <span>请输入文本信息或点击图标导入文本文件</span>
        </div>
      ) : null}
      {isEmpty(modifiedValueRef.current) && tipShow ? (
        <div className={cx(styles['editor-empty-tip'], styles['editor-empty-right'])} onClick={handleModifiedImport}>
          <MedicineBoxOutlined className={styles['add-file']} />
          <span>请输入文本信息或点击图标导入文本文件</span>
        </div>
      ) : null}

      <DiffEditor
        theme="light"
        language={language}
        height={'100%'}
        options={{
          originalEditable: true,
          enableSplitViewResizing: false,
          ...DEFAULT_OPTIONS,
          ...options,
        }}
        original={originalValueRef.current}
        modified={modifiedValueRef.current}
        onMount={handleEditorMount}
      />
    </div>
  );
};

export default BaseDiffEditor;
