import { Select } from 'antd';
import { Fragment, useMemo, useState } from 'react';

import { BaseDiffEditor, EEditorLanguage } from '@/components/Editor';
import { EDITOR_LANGUAGE_OPTIONS } from '@/constants';
import { useWindowSize } from '@/hooks';
import styles from './index.less';

const EDITOR_HEIGHT_PADDING = 116;

const Diff = () => {
  const [language, setLanguage] = useState<EEditorLanguage>(EEditorLanguage.PLAINTEXT);
  const { height } = useWindowSize();
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  return (
    <Fragment>
      <div className={styles['diff-options']}>
        <span>语言：</span>
        <Select
          style={{ width: 140, padding: '2px 0' }}
          size="small"
          showSearch
          value={language}
          onSelect={setLanguage}
          options={EDITOR_LANGUAGE_OPTIONS}
        />
      </div>
      <BaseDiffEditor tipShow={true} style={{ height: editorHeight }} language={language} />
    </Fragment>
  );
};

export default Diff;
