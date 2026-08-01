import { useCallback } from 'react';

import TransformPanel from '@/renderer/components/TransformPanel';
import { EEditorLanguage } from '@/renderer/components/Editor';
import { run } from 'json_typegen_wasm';

const DEFAULT_VALUE = `{
  "name": "fett",
  "age": 18,
  "isStudent": true,
  "hobbies": [
    "reading",
    "swimming",
    "programming"
  ],
  "address": {
    "city": "Shanghai",
    "country": "China"
  }
}`;
const JsonToTypescript = () => {
  const transformer = useCallback(async (value: string) => {
    try {
      const result = run(
        'Root',
        value,
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
      sourceLang={EEditorLanguage.JSON}
      targetLang={EEditorLanguage.TYPESCRIPT}
    />
  );
};

export default JsonToTypescript;
