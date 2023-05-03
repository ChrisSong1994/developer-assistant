import { Select } from 'antd';
import { useMemo, useState } from 'react';

import { BaseDiffEditor, EEditorLanguage } from '@/components/Editor';
import { EDITOR_LANGUAGE_OPTIONS } from '@/constants';
import { useWindowSize } from '@/hooks';
import styles from './index.less';

const EDITOR_HEIGHT_PADDING = 142;

const Diff = (props: any) => {
  const [language, setLanguage] = useState<EEditorLanguage>(EEditorLanguage.PLAINTEXT);
  const { height } = useWindowSize();
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  return (
    <div className={styles['diff']}>
      <div className={styles['diff-options']}>
        <span>语言：</span>
        <Select style={{ width: 200 }}  showSearch value={language} onSelect={setLanguage} options={EDITOR_LANGUAGE_OPTIONS} />
      </div>
      <BaseDiffEditor style={{ height: editorHeight }} language={language} />
    </div>
  );
};

export default Diff;
