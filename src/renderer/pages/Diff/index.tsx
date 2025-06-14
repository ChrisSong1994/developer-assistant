import { Select } from 'antd';
import { Fragment, useMemo, useState } from 'react';

import { BaseDiffEditor, EEditorLanguage } from '@/renderer/components/Editor';
import { EDITOR_LANGUAGE_OPTIONS } from '@/renderer/constants';
import { useWindowSize } from '@/renderer/hooks';

const EDITOR_HEIGHT_PADDING = 100;

const Diff = () => {
  const [language, setLanguage] = useState<EEditorLanguage>(EEditorLanguage.PLAINTEXT);
  const { height } = useWindowSize();
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  return (
    <Fragment>
     <div style={{ height: 32 }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>语言：</span>
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
