import { useCallback } from 'react';
import gs from 'generate-schema';

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
const JsonToMysql = () => {
  const transformer = useCallback(async (value: string) => {
    return gs.mysql(JSON.parse(value));
  }, []);

  return (
    <TransformPanel
      defaultValue={DEFAULT_VALUE}
      transformer={transformer}
      sourceLang={EEditorLanguage.JSON}
      targetLang={EEditorLanguage.SQL}
    />
  );
};

export default JsonToMysql;
