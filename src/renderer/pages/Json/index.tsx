/**
 * 1、json 格式化
 * 2、json 解析
 * 3、json 复制
 * 4、显示行号（样式处理）
 * 5、下载成json文件
 * 6、支持 json5
 * 7、支持转成json
 */
import React, { useEffect, useState } from 'react';
import Json5 from 'json5';
import AceEditor from 'react-ace';
import { Tooltip } from 'antd';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';

import { isEmpty, jsonParse } from '@/utils';
import Icon from '@/components/Icon';
import Copy from '@/components/Copy';
import styles from './index.less';

const JsonComponent = (props: any) => {
  const [value, setValue] = useState('');
  const [parseJson, setParseJson] = useState({});
  const [parseError, setParseError] = useState(null);

  // json 格式化
  const handleJsonFormat = () => {
    if (isEmpty(parseError)) {
      setValue(JSON.stringify(parseJson, null, 2));
    }
  };

  const handleCompress = () => {
    if (isEmpty(parseError)) {
      setValue(JSON.stringify(parseJson));
    }
  };

  // 清除
  const handleClear = () => {
    setValue('');
  };

  // 保存

  // json 解析
  const handleJsonParse = (value: string) => {
    if (!isEmpty(value)) {
      try {
        const data = jsonParse(value);
        setParseJson(data);
        setParseError(null);
      } catch (err: any) {
        setParseError(err.message);
      }
    } else {
      setParseError(null);
    }
  };

  useEffect(() => {
    handleJsonParse(value);
  }, [value]);

  return (
    <div className={styles['json-parse']}>
      <div className={styles['json-panel']}>
        <div className={styles['tool-panel']}>
          <Tooltip placement="bottom" title="复制">
            <Copy value={value} size={18} />
          </Tooltip>
          <Tooltip placement="bottom" title="美化">
            <Icon type="icon-qingchu" size={18} onClick={handleJsonFormat} />
          </Tooltip>
          <Tooltip placement="bottom" title="压缩">
            <Icon type="icon-wenjianyasuo" size={18} onClick={handleCompress} />
          </Tooltip>
          {/* <Tooltip placement="bottom" title="保存">
            <Icon type="icon-baocun" size={18} />
          </Tooltip> */}
          <Tooltip placement="bottom" title="清除">
            <Icon type="icon-shanchu" size={18} onClick={handleClear} />
          </Tooltip>
        </div>
        <AceEditor
          placeholder="请输入 json 数据..."
          mode="json"
          theme="chrome"
          name="json"
          style={{
            width: '100%',
            height: 800,
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
      {isEmpty(parseError) ? null : <div className={styles['error-panel']}>{parseError}</div>}
    </div>
  );
};

export default JsonComponent;
