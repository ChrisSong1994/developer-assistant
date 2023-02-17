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
import jsonlint from 'jsonlint-mod';
import AceEditor from 'react-ace';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';

import styles from './index.less';
import { useWindowSize } from '@/hooks';

const EDITOR_HEIGHT_PADDING = 148;

const JsonConvertComponent = () => {
  const [value, setValue] = useState('');

  const { height } = useWindowSize();
  const editorHeight = useMemo(() => height - EDITOR_HEIGHT_PADDING, [height]); // 编辑器高度

  // 保存

  // // json 解析
  // const handleJsonParse = (value: string) => {
  //   if (!isEmpty(value)) {
  //     try {
  //       const data = jsonlint.parse(value);
  //       setParseJson(data);
  //       setParseError(null);
  //     } catch (err: any) {
  //       setParseError(err.message);
  //     }
  //   } else {
  //     setParseError(null);
  //   }
  // };

  useEffect(() => {
    // handleJsonParse(value);
  }, [value]);

  useEffect(() => {}, []);

  return (
    <div className={styles['json-convert']}>
      <AceEditor
        placeholder="请输入 json 数据..."
        mode="json"
        theme="chrome"
        name="json"
        style={{
          flex: 1,
          height: editorHeight,
          border: '1px solid #E9E9E9',
        }}
        fontSize={16}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 4,
        }}
        value={value}
        onChange={setValue}
      />

      <div className={styles['json-convert-actions']}>
        <Button icon={<LeftOutlined />} />
        <Button icon={<RightOutlined />} />
      </div>

      <AceEditor
        placeholder="请输入 yaml 数据..."
        mode="yaml"
        theme="chrome"
        name="yaml"
        style={{
          flex: 1,
          height: editorHeight,
          border: '1px solid #E9E9E9',
        }}
        fontSize={16}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 4,
        }}
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export default JsonConvertComponent;
