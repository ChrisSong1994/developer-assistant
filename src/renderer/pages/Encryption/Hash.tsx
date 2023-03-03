import { createHash } from '@/servies';
import { Button, Input, Space } from 'antd';
import { useState } from 'react';

// import styles from './index.less';

const TextArea = Input.TextArea;

const HASH_ARITHMETIC_LIST = [
  {
    title: 'MD5',
    value: 'MD5',
  },
  {
    title: '',
    value: '',
  },
  {
    title: '',
    value: '',
  },
  {
    title: '',
    value: '',
  },
  {
    title: '',
    value: '',
  },
];

const Hash = () => {
  const [decipherValue, setDecipherValue] = useState<string>('');

  const [encipherValue, setEncipherValue] = useState<string>('');

  const handleEncrypt = async () => {
    const res = await createHash({
      hash: 'md5',
      content: decipherValue,
    });
    setEncipherValue(res);
  };

  return (
    <div>
      <TextArea
        rows={10}
        placeholder="请输入需加密内容"
        value={decipherValue}
        onChange={(e) => setDecipherValue(e.target.value)}
      />
      <div
        style={{
          margin: '16px 0',
        }}
      >
        <Space>
          <Button type="primary" onClick={handleEncrypt}>
            加密
          </Button>
          {/* <Button type="primary" onClick={handleDecode}>
            解码
          </Button> */}
        </Space>
      </div>
      <TextArea
        rows={10}
        placeholder="请输入编码内容"
        value={encipherValue}
        // onChange={(e) => setEncodeValue(e.target.value)}
      />
    </div>
  );
};

export default Hash;
