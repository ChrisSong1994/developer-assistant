/**
 * 1、json 格式化
 * 2、json 解析
 * 3、json 复制
 * 4、显示行号（样式处理）
 * 5、下载成json文件
 * 6、支持 json5
 * 7、支持转成json
 */
import { useEffect, useMemo, useState } from 'react';
// @ts-ignore
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import jsonlint from 'jsonlint-mod';
import yaml from 'yaml';

import { JsonEditor, YamlEditor } from '@/components/Editor';
import { useWindowSize } from '@/hooks';
import { isEmpty } from '@/utils';
import styles from './index.less';

const EDITOR_HEIGHT_PADDING = 164;

const JsonConvertComponent = () => {
  const [jsonValue, setJsonValue] = useState('');
  const [yamlValue, setYamlValue] = useState('');
  const [parseJsonError, setParseJsonError] = useState(null);
  const [parseYamlError, setParseYamlError] = useState(null);

  const { height } = useWindowSize();
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  // // json 解析
  const handleJsonParse = (value: string) => {
    if (!isEmpty(value)) {
      try {
        jsonlint.parse(value);
        setParseJsonError(null);
      } catch (err: any) {
        setParseJsonError(err.message);
      }
    } else {
      setParseJsonError(null);
    }
  };

  //  yaml 解析
  const handleYamlParse = (value: string) => {
    if (!isEmpty(value) && !parseJsonError) {
      try {
        console.log(yaml.parse(value));
        setParseYamlError(null);
      } catch (err: any) {
        console.log(err.message);
        setParseYamlError(err.message);
      }
    } else {
      setParseYamlError(null);
    }
  };

  useEffect(() => {
    handleJsonParse(jsonValue);
  }, [jsonValue]);

  useEffect(() => {
    handleYamlParse(yamlValue);
  }, [yamlValue]);

  return (
    <div className={styles['json-convert']}>
      <div className={styles['json-convert-panel']}>
        <div className={styles['json-convert-panel-title']}>JSON</div>
        <JsonEditor style={{ height: editorHeight }} value={jsonValue} onChange={setJsonValue} />
      </div>
      <div className={styles['json-convert-actions']}>
        <Tooltip title="JSON 转 YAML">
          <Button icon={<RightOutlined />} />
        </Tooltip>
        <Tooltip title="YAML 转 JSON">
          <Button icon={<LeftOutlined />} />
        </Tooltip>
      </div>
      <div className={styles['json-convert-panel']}>
        <div className={styles['json-convert-panel-title']}>YAML</div>
        <YamlEditor style={{ height: editorHeight }} value={yamlValue} onChange={setYamlValue} />
      </div>
    </div>
  );
};

export default JsonConvertComponent;
