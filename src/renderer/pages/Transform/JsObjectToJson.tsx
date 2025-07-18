import { useCallback } from 'react';
import gofmt from 'gofmt.js';

import { jsonToGo } from './utils';
import TransformPanel from '@/renderer/components/TransformPanel';
import { EEditorLanguage } from '@/renderer/components/Editor';

const DEFAULT_VALUE = `{
	title: {
		type: 'String',
		trim: true,
		index: true,
		required: true
	},
	year: {
		type: 'Number',
		max: 2012,
		validate: 'validateBookYear'
	},
	author: {
		type: 'ObjectId',
		ref: 'Author',
		index: true,
		required: true
	}
}`;
const JsObjectToJson = () => {
  const transformer = useCallback(async (value: string) => {
    return JSON.stringify(eval('(' + value + ')'), null, 2);
  }, []);

  return (
    <TransformPanel
      defaultValue={DEFAULT_VALUE}
      transformer={transformer}
      sourceLang={EEditorLanguage.JAVASCRIPT}
      targetLang={EEditorLanguage.GO}
    />
  );
};

export default JsObjectToJson;
