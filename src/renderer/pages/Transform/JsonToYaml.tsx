import { useCallback } from 'react';
import jsonlint from 'jsonlint-mod';
import YAML from 'yaml';

import TransformPanel from '@/renderer/components/TransformPanel';
import { EEditorLanguage } from '@/renderer/components/Editor';
import { isEmpty } from '@fett/utils';

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
const JsonToYaml = () => {
  // // json 解析
  const handleJsonParse = (value: string): boolean => {
    if (!isEmpty(value)) {
      try {
        jsonlint.parse(value);
        return true;
      } catch (err: any) {
        return false;
      }
    } else {
      return false;
    }
  };

  const transformer = useCallback(async (value: string) => {
    if (value && handleJsonParse(value)) {
      const res = YAML.stringify(JSON.parse(value));
      return res;
    }
    return '';
  }, []);

  return (
    <TransformPanel
      defaultValue={DEFAULT_VALUE}
      transformer={transformer}
      sourceLang={EEditorLanguage.JSON}
      targetLang={EEditorLanguage.YAML}
    />
  );
};

export default JsonToYaml;
