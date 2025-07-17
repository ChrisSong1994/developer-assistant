import { useEffect, useState } from 'react';
import { BaseEditor, EEditorLanguage } from '@/renderer/components/Editor';

import styles from './index.module.less';

const EDITOR_HEIGHT_PADDING = 100;

export type TransformPanelProps = {
  defaultValue: string;
  sourceLang: EEditorLanguage;
  targetLang: EEditorLanguage;
  transformer: (value: string) => Promise<string>;
};
const TransformPanel = (props: TransformPanelProps) => {
  const { defaultValue, sourceLang, targetLang, transformer } = props;

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
          style={{ height: `calc(100vh - ${EDITOR_HEIGHT_PADDING}px)`, border: 'none' }}
          value={value}
          onChange={setValue}
        />
      </div>
      <div className={styles['panel']}>
        <BaseEditor
          language={targetLang}
          style={{ height: `calc(100vh - ${EDITOR_HEIGHT_PADDING}px)`, border: 'none' }}
          value={result}
        />
      </div>
    </div>
  );
};

export default TransformPanel;
