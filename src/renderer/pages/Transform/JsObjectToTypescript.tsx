import { useCallback } from 'react';

import TransformPanel from '@/renderer/components/TransformPanel';
import { EEditorLanguage } from '@/renderer/components/Editor';
import { run } from 'json_typegen_wasm';

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
const JsObjectToTypescript = () => {
  const transformer = useCallback(async (value: string) => {
    try {
      const json = JSON.stringify(eval('(' + value + ')'), null, 2);
      const result = run(
        'Root',
        json,
        JSON.stringify({
          output_mode: 'typescript/typealias', //"typescript"
        }),
      );
      return result;
    } catch (e) {
      return '';
    }
  }, []);

  return (
    <TransformPanel
      defaultValue={DEFAULT_VALUE}
      transformer={transformer}
      sourceLang={EEditorLanguage.JAVASCRIPT}
      targetLang={EEditorLanguage.TYPESCRIPT}
    />
  );
};

export default JsObjectToTypescript;
