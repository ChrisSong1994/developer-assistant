import Events from '@/renderer/utils/events';
import { Button, Form, Input, Select } from 'antd';
import { useState } from 'react';

import { HASH_ARITHMETIC_OPTIONS } from '@/renderer/constants';
import { IHashOptions } from '../../../main/modules/crypto';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

const Hash = () => {
  const [form] = Form.useForm();
  const [decipherValue, setDecipherValue] = useState<string>('');
  const [encipherValue, setEncipherValue] = useState<string>('');

  const handleEncrypt = async (values: IHashOptions) => {
    const res = await Events.createHash({
      hash: values.hash,
      content: encipherValue,
      key: values.key,
    });
    setDecipherValue(res);
  };

  return (
    <div>
      <TextArea
        rows={12}
        placeholder="请输入需待加密内容"
        value={encipherValue}
        onChange={(e) => setEncipherValue(e.target.value)}
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
            <Select style={{ width: 140 }} options={HASH_ARITHMETIC_OPTIONS}></Select>
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
      <TextArea spellCheck={false} rows={12} placeholder="请输入待解密内容" value={decipherValue} />
    </div>
  );
};

export default Hash;
