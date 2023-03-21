import { createHash } from '@/servies';
import { Button, Form, Input, Select } from 'antd';
import { useState } from 'react';

import { HASH_ARITHMETIC_LIST } from '@/constants';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

const Hash = () => {
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
            hash: 'MD5',
          }}
          form={form}
          onFinish={handleEncrypt}
        >
          <FormItem name="hash" label="算法">
            <Select style={{ width: 140 }} options={HASH_ARITHMETIC_LIST}></Select>
          </FormItem>
          <Form.Item noStyle shouldUpdate={(pre, cur) => pre.hash !== cur.hash}>
            {({ getFieldValue }) => {
              const hashValue = getFieldValue('hash');
              if (hashValue && hashValue.startsWith('Hmac')) {
                return (
                  <FormItem name="key" label="密钥">
                    {form.getFieldValue('hash').startsWith('Hmac') ? <Input style={{ width: 200 }} /> : null}
                  </FormItem>
                );
              }
              return null;
            }}
          </Form.Item>

          <FormItem>
            <Button type="primary" htmlType="submit">
              加密
            </Button>
          </FormItem>
        </Form>
      </div>
      <TextArea spellCheck={false} rows={10} placeholder="请输入编码内容" value={encipherValue} />
    </div>
  );
};

export default Hash;
