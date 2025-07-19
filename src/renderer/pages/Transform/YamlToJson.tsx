import { useCallback } from 'react';
import YAML from 'yaml';

import TransformPanel from '@/renderer/components/TransformPanel';
import { EEditorLanguage } from '@/renderer/components/Editor';
import { isEmpty } from '@fett/utils';

const DEFAULT_VALUE = `
name: fett
age: 18
isStudent: true
hobbies:
  - reading
  - swimming
  - programming
address:
  city: Shanghai
  country: China
`;
const YamlToJson = () => {
  //  yaml 解析
  const handleYamlParse = (value: string): boolean => {
    if (!isEmpty(value)) {
      try {
        YAML.parse(value);
        return true;
      } catch (err: any) {
        return false;
      }
    } else {
      return false;
    }
  };

  const transformer = useCallback(async (value: string) => {
    if (value && handleYamlParse(value)) {
      const res = YAML.parse(value);
      return JSON.stringify(res, null, 2);
    }
    return '';
  }, []);

  return (
    <TransformPanel
      defaultValue={DEFAULT_VALUE}
      transformer={transformer}
      sourceLang={EEditorLanguage.YAML}
      targetLang={EEditorLanguage.JSON}
    />
  );
};

export default YamlToJson;
