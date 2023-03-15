import { Button, Input, Space } from 'antd';
import { Fragment, useState } from 'react';
// @ts-ignore
import Base64 from 'Base64';
const TextArea = Input.TextArea;

const Base64CodingComponent = () => {
  const [decodeValue, setDecodeValue] = useState<string>('');

  const [encodeValue, setEncodeValue] = useState<string>('');

  const handleEncode = () => {
    const res = Base64.btoa(decodeValue);
    setEncodeValue(res);
  };

  const handleDecode = () => {
    const res = Base64.atob(encodeValue);
    setDecodeValue(res);
  };

  return (
    <Fragment>
      <TextArea
        rows={10}
        placeholder="请输入编码内容"
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
        rows={10}
        placeholder="请输入编码内容"
        value={encodeValue}
        onChange={(e) => setEncodeValue(e.target.value)}
      />
    </Fragment>
  );
};

export default Base64CodingComponent;
