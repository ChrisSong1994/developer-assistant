import { useMemo } from 'react';

import { DiffEditor } from '@/components/Editor';
import { useWindowSize } from '@/hooks';
import styles from './index.less';

const EDITOR_HEIGHT_PADDING = 180;

const Diff = (props: any) => {
  const { height } = useWindowSize();
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  return (
    <div className={styles['diff']} style={{ height: editorHeight }}>
      <DiffEditor />
    </div>
  );
};

export default Diff;
