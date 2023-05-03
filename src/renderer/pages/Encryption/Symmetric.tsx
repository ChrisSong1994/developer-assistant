import { AES_BLOCK_OPTIONS, OUTPUT_ENCODING_OPTIONS, SYMMETRIC_ENCRYPTION_ARITHMETRIC_OPTIONS } from '@/constants';
import Events from '@/utils/events';
import { Button, Form, Input, Select } from 'antd';
import { useState } from 'react';
import { IHashOptions } from '../../../main/modules/crypto';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

const Symmetric = () => {
  const [form] = Form.useForm();
  const [decipherValue, setDecipherValue] = useState<string>('');

  const [encipherValue, setEncipherValue] = useState<string>('');

  const handleEncrypt = async (values: IHashOptions) => {
    const res = await Events.createHash({
      hash: values.hash,
      content: decipherValue,
      key: values.key,
    });
    setEncipherValue(res);
  };

  return (
    <div>
      <TextArea
        spellCheck={false}
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
            <Select style={{ width: 82 }} options={SYMMETRIC_ENCRYPTION_ARITHMETRIC_OPTIONS}></Select>
          </FormItem>
          <FormItem name="block" label="数据块">
            <Select style={{ width: 82 }} options={AES_BLOCK_OPTIONS}></Select>
          </FormItem>
          <FormItem name="key" label="密钥">
            <Input style={{ width: 200 }} />
          </FormItem>
          <FormItem name="iv" label="偏移量">
            <Input style={{ width: 120 }} />
          </FormItem>
          <FormItem name="outputEncoding" label="输出">
            <Select style={{ width: 100 }} options={OUTPUT_ENCODING_OPTIONS}></Select>
          </FormItem>

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

export default Symmetric;
