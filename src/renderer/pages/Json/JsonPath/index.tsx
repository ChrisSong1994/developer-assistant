import { memo, useState, useEffect } from 'react';
import { Input, Dropdown, Button, Space } from 'antd';
import { JSONPathJS } from 'jsonpath-js';
import { CaretDownOutlined, FileSearchOutlined } from '@ant-design/icons';

import { BaseEditor, EEditorLanguage } from '@/renderer/components/Editor';
import CheatSheet from './CheatSheet';
import './index.css';

const JsonPath = (props: { jsonData: Record<string, any> }) => {
  const [jsonpath, setJsonpath] = useState('$');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleJsonPath = (jsonpath: string) => {
    try {
      const query = new JSONPathJS(jsonpath);
      const result = query.find(props.jsonData ?? {});
      setResult(JSON.stringify(result, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    handleJsonPath(jsonpath);
  }, [jsonpath]);

  return (
    <div className="json-path-container">
      <div className="header">
        <Input
          allowClear
          size="large"
          addonBefore="JSONPath"
          placeholder="输入 JSONPath 表达式"
          value={jsonpath}
          onChange={(e) => setJsonpath(e.target.value)}
        />
        <Dropdown trigger={['click']} popupRender={() => <CheatSheet />}>
          <Button style={{ width: 140, marginLeft: 12 }} type="primary" size="large">
            <Space>
              <FileSearchOutlined /> 语法参考
              <CaretDownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>
      <div className="text">
        {error ? (
          <div className="error"> {error}</div>
        ) : (
          <div className="tip">输入符合 JSONPath 的表达式，点击「语法参考」查看更多语法。</div>
        )}
      </div>

      <BaseEditor
        style={{
          height: 'calc(100vh - 175px)',
        }}
        language={EEditorLanguage.JSON}
        value={result}
        tipShow={true}
      />
    </div>
  );
};

export default memo(JsonPath);
