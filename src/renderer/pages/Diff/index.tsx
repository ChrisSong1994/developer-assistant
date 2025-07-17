import { Select } from 'antd';
import { Fragment, useState } from 'react';

import { BaseDiffEditor, EEditorLanguage } from '@/renderer/components/Editor';
import { EDITOR_LANGUAGE_OPTIONS } from '@/renderer/constants';

const EDITOR_HEIGHT_PADDING = 103;

const Diff = () => {
  const [language, setLanguage] = useState<EEditorLanguage>(EEditorLanguage.PLAINTEXT);

  return (
    <Fragment>
      <div style={{ height: 36 }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>语言：</span>
        <Select
          style={{ width: 140, padding: '2px 0' }}
          showSearch
          value={language}
          onSelect={setLanguage}
          options={EDITOR_LANGUAGE_OPTIONS}
        />
      </div>
      <BaseDiffEditor
        tipShow={true}
        style={{ height: `calc(100vh - ${EDITOR_HEIGHT_PADDING}px)` }}
        language={language}
      />
    </Fragment>
  );
};

export default Diff;
