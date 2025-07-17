import { useEffect, useMemo, useState } from 'react';
import { BaseEditor, EEditorLanguage } from '@/renderer/components/Editor';
import { useWindowSize } from '@/renderer/hooks';

import styles from './index.module.less';

const EDITOR_HEIGHT_PADDING = 101;

export type TransformPanelProps = {
  defaultValue: string;
  sourceLang: EEditorLanguage;
  targetLang: EEditorLanguage;
  transformer: (value: string) => Promise<string>;
};
const TransformPanel = (props: TransformPanelProps) => {
  const { defaultValue, sourceLang, targetLang, transformer } = props;

  const { height } = useWindowSize();
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  const [value, setValue] = useState(defaultValue);
  const [result, setResult] = useState('');

  const handleTransform = async (value: string) => {
    const result = await transformer(value);
    setResult(result);
  };

  useEffect(() => {
    handleTransform(value);
  }, [value]);

  return (
    <div className={styles['transform-panel']}>
      <div className={styles['panel']}>
        <BaseEditor
          language={sourceLang}
          style={{ height: editorHeight, border: 'none' }}
          value={value}
          onChange={setValue}
        />
      </div>
      <div className={styles['panel']}>
        <BaseEditor language={targetLang} style={{ height: editorHeight, border: 'none' }} value={result} />
      </div>
    </div>
  );
};

export default TransformPanel;
