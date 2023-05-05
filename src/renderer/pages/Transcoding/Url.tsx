import { Button, Input, Space } from 'antd';
import { Fragment, useState } from 'react';

const TextArea = Input.TextArea;

const UrlCodingComponent = () => {
  const [decodeValue, setDecodeValue] = useState<string>('');

  const [encodeValue, setEncodeValue] = useState<string>('');

  const handleEncode = () => {
    const res = encodeURIComponent(decodeValue);
    setEncodeValue(res);
  };

  const handleDecode = () => {
    const res = decodeURIComponent(encodeValue);
    setDecodeValue(res);
  };

  return (
    <Fragment>
      <TextArea
        spellCheck={false}
        rows={10}
        placeholder="请输入待编码内容"
        value={decodeValue}
        onChange={(e) => setDecodeValue(e.target.value)}
      />
      <div
        style={{
          margin: '16px 0',
        }}
      >
        <Space>
          <Button type="primary" onClick={handleEncode}>
            编码
          </Button>
          <Button type="primary" onClick={handleDecode}>
            解码
          </Button>
        </Space>
      </div>

      <TextArea
        spellCheck={false}
        rows={10}
        placeholder="请输入待解码内容"
        value={encodeValue}
        onChange={(e) => setEncodeValue(e.target.value)}
      />
    </Fragment>
  );
};

export default UrlCodingComponent;
