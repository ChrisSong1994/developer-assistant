import { memo, useState } from 'react';
import { Form, Button, Radio } from 'antd';

import TextArea from '@/components/TextArea';
import PageLayout from '@/components/PageLayout';
import { generateKey } from '@/servies';

const GenerateKey = () => {
  const [data, setData] = useState({
    privateKey: '',
    publicKey: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: any) => {
    const execFunc = generateKey;
    setLoading(true);
    const result = await execFunc({
      pkcs: values.formatter,
      rsaType: values.length,
    });
    setData(result.data);
    setLoading(false);
  };

  return (
    <PageLayout>
      <Form
        onFinish={handleSubmit}
        initialValues={{
          length: 'RSA2',
          formatter: 'JAVA',
        }}
      >
        <Form.Item name="formatter" label="密钥长度">
          <Radio.Group>
            <Radio value="JAVA">PKCS8（JAVA适用）</Radio>
            <Radio value="OTHER"> PKCS1（非JAVA适用）</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            生成密钥
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginBottom: 24 }}>
        <TextArea label="应用私钥" value={data.privateKey} />
      </div>
      <TextArea label="应用公钥" value={data.publicKey} />
    </PageLayout>
  );
};

export default memo(GenerateKey);
