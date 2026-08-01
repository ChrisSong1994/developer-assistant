import { useCallback } from 'react';
import { run } from 'json_typegen_wasm';
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
const JsonToJsonSchema = () => {
  const transformer = useCallback(async (value: string) => {
    return run(
      'Root',
      value,
      JSON.stringify({
        output_mode: 'json_schema',
      }),
    );
  }, []);

  return (
    <TransformPanel
      defaultValue={DEFAULT_VALUE}
      transformer={transformer}
      sourceLang={EEditorLanguage.JSON}
      targetLang={EEditorLanguage.JSON}
    />
  );
};

export default JsonToJsonSchema;
