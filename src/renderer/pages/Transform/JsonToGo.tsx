import { useCallback } from 'react';
import init, { format } from '@wasm-fmt/gofmt';

import { jsonToGoStruct } from './utils';
import TransformPanel from '@/renderer/components/TransformPanel';
import { EEditorLanguage } from '@/renderer/components/Editor';

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
const JsonToGo = () => {
  const transformer = useCallback(async (value: string) => {
    await init();
    return format(jsonToGoStruct(value));
  }, []);

  return (
    <TransformPanel
      defaultValue={DEFAULT_VALUE}
      transformer={transformer}
      sourceLang={EEditorLanguage.JSON}
      targetLang={EEditorLanguage.GO}
    />
  );
};

export default JsonToGo;
