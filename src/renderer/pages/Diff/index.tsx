import { Select } from 'antd';
import { useMemo, useState } from 'react';

import { DiffEditor } from '@/components/Editor';
import { useWindowSize } from '@/hooks';
import styles from './index.less';

const EDITOR_HEIGHT_PADDING = 130;

const Diff = (props: any) => {
  const [language, setLanguage] = useState<string>('text');
  const { height } = useWindowSize();
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  return (
    <div className={styles['diff']}>
      <div>
        <span>语言：</span>
        <Select
          style={{ width: 180 }}
          value={language}
          onSelect={setLanguage}
          options={[
            {
              value: 'json',
              label: 'JSON',
            },
            {
              value: 'text',
              label: 'TEXT',
            },
          ]}
        />
      </div>

      <div style={{ height: editorHeight }}>
        <DiffEditor language={language} />
      </div>
    </div>
  );
};

export default Diff;
