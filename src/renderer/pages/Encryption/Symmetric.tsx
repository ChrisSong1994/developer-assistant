import { AES_BLOCK_LIST, OUTPUT_ENCODING_LIST, SYMMETRIC_ENCRYPTION_ARITHMETRIC_LIST } from '@/constants';
import { createHash } from '@/servies';
import { Button, Form, Input, Select } from 'antd';
import { useState } from 'react';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

const Symmetric = () => {
  const [form] = Form.useForm();
  const [decipherValue, setDecipherValue] = useState<string>('');

  const [encipherValue, setEncipherValue] = useState<string>('');

  const handleEncrypt = async (values: { hash: string; key: string }) => {
    const res = await createHash({
      hash: values.hash,
      content: decipherValue,
      key: values.key,
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
        <Form
          layout={'inline'}
          initialValues={{
            hash: 'AES',
          }}
          form={form}
          onFinish={handleEncrypt}
        >
          <FormItem name="algorithm" label="算法">
            <Select style={{ width: 82 }} options={SYMMETRIC_ENCRYPTION_ARITHMETRIC_LIST}></Select>
          </FormItem>
          <FormItem name="block" label="数据块">
            <Select style={{ width: 82 }} options={AES_BLOCK_LIST}></Select>
          </FormItem>
          <FormItem name="key" label="密钥">
            <Input style={{ width: 200 }} />
          </FormItem>
          <FormItem name="iv" label="偏移量">
            <Input style={{ width: 120 }} />
          </FormItem>
          <FormItem name="outputEncoding" label="输出">
            <Select style={{ width: 100 }} options={OUTPUT_ENCODING_LIST}></Select>
          </FormItem>

          <FormItem>
            <Button type="primary" htmlType="submit">
              加密
            </Button>
          </FormItem>
        </Form>
      </div>
      <TextArea rows={10} placeholder="请输入编码内容" value={encipherValue} />
    </div>
  );
};

export default Symmetric;