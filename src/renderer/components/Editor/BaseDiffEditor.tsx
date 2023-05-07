import { MedicineBoxOutlined } from '@ant-design/icons';
import { cx } from '@emotion/css';
import { DiffEditor, Monaco } from '@monaco-editor/react';
import _ from 'lodash';

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
        const position = originalEditor.getPosition();
        update();
        // hack 方式： 为了解决render后光标错位问题
        setTimeout(() => {
          originalEditor.setPosition({
            lineNumber: position.lineNumber,
            column: position.column + newOriginalValue.length,
          });
          originalEditor.focus();
        });
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

  const handleFileDrop = async (event: any) => {
    event.stopPropagation();
    const file = _.get(event, 'dataTransfer.files[0');
    if (file?.path) {
      const originalElement = document.querySelector('.editor.original');
      const modifiedElement = document.querySelector('.editor.modified');
      const fileValue = await Events.getFileFromPath({ filePath: file.path });
      if (originalElement?.contains(event.target)) {
        originalValueRef.current = fileValue;
      }
      if (modifiedElement?.contains(event.target)) {
        modifiedValueRef.current = fileValue;
      }
      update();
    }
  };

  return (
    <div className={styles['editor-wrap']} style={style} onDrop={handleFileDrop}>
      {isEmpty(originalValueRef.current) && tipShow ? (
        <div
          className={cx('diff-editor-left', styles['editor-empty-tip'], styles['editor-empty-left'])}
          onClick={handleOriginalImport}
        >
          <MedicineBoxOutlined className={styles['add-file']} />
          <span>请输入文本信息或点击图标导入文本文件</span>
        </div>
      ) : null}
      {isEmpty(modifiedValueRef.current) && tipShow ? (
        <div
          className={cx('diff-editor-right', styles['editor-empty-tip'], styles['editor-empty-right'])}
          onClick={handleModifiedImport}
        >
          <MedicineBoxOutlined className={styles['add-file']} />
          <span>请输入文本信息或点击图标导入文本文件</span>
        </div>
      ) : null}

      <DiffEditor
        theme="light"
        language={language}
        height={'100%'}
        loading={null}
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
