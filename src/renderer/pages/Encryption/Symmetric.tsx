import { Button, Form, Input, Select, Space } from 'antd';
import { useMemo, useState } from 'react';

import { to } from '@/utils';
import Events from '@/utils/events';
import {
  ENCRYPTION_ALGORITHM_OPTIONS,
  ENCRYPTION_ALGORITHM_OPTIONS_MAP,
  ENCRYPTION_PADDING_OPTIONS,
  OUTPUT_ENCODING_OPTIONS,
  TAlgorithm,
} from '../../../common/contants/crypto';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

interface ICipherOptions {
  algorithm: TAlgorithm;
  format: 'hex' | 'base64';
  padding: string;
}

const INITIAL_VALUES: ICipherOptions = {
  algorithm: 'AES-128-CBC',
  format: 'hex',
  padding: 'Pkcs7',
};

const Symmetric = () => {
  const [form] = Form.useForm();
  const [decipherValue, setDecipherValue] = useState<string>('');
  const [encipherValue, setEncipherValue] = useState<string>('');
  const [options, setOptions] = useState<ICipherOptions>(INITIAL_VALUES);

  const algorithmConfig = useMemo(() => ENCRYPTION_ALGORITHM_OPTIONS_MAP[options.algorithm], [options.algorithm]);

  const handleEncrypt = async () => {
    const [res, err] = await to(form.validateFields());
    if (err) return;
    const encrypted = await Events.encrypt({
      ...res,
      content: encipherValue,
    });
    setDecipherValue(encrypted);
  };

  const handleDecrypt = async () => {
    // const [res,err] = await to(form.validateFields())
    // if(err) return
    // console.log(res)
  };

  return (
    <div>
      <TextArea
        spellCheck={false}
        rows={12}
        placeholder="请输入需待加密内容"
        value={encipherValue}
        onChange={(e) => setEncipherValue(e.target.value)}
      />
      <div
        style={{
          margin: '16px 0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Form
          layout={'inline'}
          form={form}
          initialValues={INITIAL_VALUES}
          onValuesChange={(_changedValues, allValues) => setOptions(allValues)}
        >
          <FormItem name="algorithm" label="算法" style={{ marginBottom: 16 }}>
            <Select style={{ width: 180 }} showSearch options={ENCRYPTION_ALGORITHM_OPTIONS}></Select>
          </FormItem>
          <FormItem name="key" label="密钥" style={{ marginBottom: 16 }}>
            <Input placeholder={`请输入${algorithmConfig.keySize}bytes长度`} style={{ width: 200 }} />
          </FormItem>
          {algorithmConfig.requireIv ? (
            <FormItem name="iv" label="偏移量" style={{ marginBottom: 16 }}>
              <Input placeholder="请输入16bytes长度偏移量" style={{ width: 200 }} />
            </FormItem>
          ) : null}
          {algorithmConfig.requirePadding ? (
            <FormItem name="padding" label="填充" style={{ marginBottom: 16 }}>
              <Select style={{ width: 180 }} showSearch options={ENCRYPTION_PADDING_OPTIONS}></Select>
            </FormItem>
          ) : null}

          <FormItem name="format" label="格式" style={{ marginBottom: 16 }}>
            <Select style={{ width: 100 }} options={OUTPUT_ENCODING_OPTIONS}></Select>
          </FormItem>
        </Form>
        <Space>
          <Button type="primary" onClick={handleEncrypt}>
            加密
          </Button>
          <Button type="primary" onClick={handleDecrypt}>
            解密
          </Button>
        </Space>
      </div>
      <TextArea
        spellCheck={false}
        rows={12}
        placeholder="请输入待解密内容"
        value={decipherValue}
        onChange={(e) => setDecipherValue(e.target.value)}
      />
    </div>
  );
};

export default Symmetric;
