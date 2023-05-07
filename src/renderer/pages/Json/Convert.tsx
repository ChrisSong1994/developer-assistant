/**
 * 1、json 格式化
 * 2、json 解析
 * 3、json 复制
 * 4、显示行号（样式处理）
 * 5、下载成json文件
 * 6、支持 json5
 * 7、支持转成json
 */
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import YAML from 'yaml';

import { JsonEditor, YamlEditor } from '@/components/Editor';
import { useWindowSize } from '@/hooks';
import { isEmpty } from '@/utils';
import styles from './index.less';

const EDITOR_HEIGHT_PADDING = 148;

const JsonConvertComponent = () => {
  const [jsonText, setJsonText] = useState('');
  const [yamlText, setYamlText] = useState('');
  const [parseJsonError, setParseJsonError] = useState(null);
  const [parseYamlError, setParseYamlError] = useState(null);

  const { height } = useWindowSize();
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  // // json 解析
  const handleJsonParse = (value: string) => {
    if (!isEmpty(value)) {
      try {
        JSON.parse(value);
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
        YAML.parse(value);
        setParseYamlError(null);
      } catch (err: any) {
        setParseYamlError(err.message);
      }
    } else {
      setParseYamlError(null);
    }
  };

  const handleCovertYamlTOJson = () => {
    if (!parseYamlError && yamlText) {
      const res = YAML.parse(yamlText);
      setJsonText(JSON.stringify(res, null, 2));
    }
  };

  const handleConvertJsonTOYaml = () => {
    if (!parseJsonError) {
      const res = YAML.stringify(JSON.parse(jsonText));
      setYamlText(res);
    }
  };

  useEffect(() => {
    handleJsonParse(jsonText);
  }, [jsonText]);

  useEffect(() => {
    handleYamlParse(yamlText);
  }, [yamlText]);

  return (
    <div className={styles['json-convert']}>
      <div className={styles['json-convert-panel']}>
        <div className={styles['json-convert-panel-title']}>JSON</div>
        <JsonEditor style={{ height: editorHeight }} value={jsonText} onChange={setJsonText} />
      </div>
      <div className={styles['json-convert-actions']}>
        <Tooltip title="JSON 转 YAML">
          <Button icon={<RightOutlined />} onClick={handleConvertJsonTOYaml} />
        </Tooltip>
        <Tooltip title="YAML 转 JSON">
          <Button icon={<LeftOutlined />} onClick={handleCovertYamlTOJson} />
        </Tooltip>
      </div>
      <div className={styles['json-convert-panel']}>
        <div className={styles['json-convert-panel-title']}>YAML</div>
        <YamlEditor style={{ height: editorHeight }} value={yamlText} onChange={setYamlText} />
      </div>
    </div>
  );
};

export default JsonConvertComponent;
