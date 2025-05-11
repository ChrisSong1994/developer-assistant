import { Button, Form, Input, Select, Space } from 'antd';
import { Fragment, useMemo, useState } from 'react';

import { to } from '@/renderer/utils';
import Events from '@/renderer/utils/events';
import {
  ENCRYPTION_ALGORITHM_OPTIONS,
  ENCRYPTION_MODE_OPTIONS,
  ENCRYPTION_PADDING_OPTIONS,
  OUTPUT_ENCODING_OPTIONS,
  TAlgorithm,
} from '../../../common/contants/crypto';
import styles from './index.module.less';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

interface ICipherOptions {
  algorithm: TAlgorithm;
  format: 'hex' | 'base64';
  padding: string;
  mode: string;
}

const INITIAL_VALUES: ICipherOptions = {
  algorithm: 'AES',
  format: 'hex',
  padding: 'Pkcs7',
  mode: 'CBC',
};

const Symmetric = () => {
  const [form] = Form.useForm();
  const [decipherValue, setDecipherValue] = useState<string>('');
  const [encipherValue, setEncipherValue] = useState<string>('');
  const [options, setOptions] = useState<ICipherOptions>(INITIAL_VALUES);

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
    const [res, err] = await to(form.validateFields());
    if (err) return;
    const encrypted = await Events.decrypt({
      ...res,
      content: decipherValue,
    });
    setEncipherValue(encrypted);
  };

  const renderAesOptions = useMemo(() => {
    const keyValidator = (_: any, value: string) => {
      if (!value) return Promise.reject(new Error('请输入密钥'));
      if (![16, 24, 32].includes(value.length)) {
        return Promise.reject(new Error('密钥格式错误'));
      }
      return Promise.resolve();
    };

    const ivValidator = (_: any, value: string) => {
      if (!value) return Promise.reject(new Error('请输入偏移量'));
      if (options.mode === 'CTR') {
        if (value.length < 1 && value.length > 15) {
          return Promise.reject(new Error('偏移量格式错误'));
        }
      } else {
        if (value.length !== 16) {
          return Promise.reject(new Error('偏移量格式错误'));
        }
      }
      return Promise.resolve();
    };

    return (
      <Fragment>
        <FormItem className={styles['form-item']} name="mode" label="模式">
          <Select style={{ width: 100 }} showSearch options={ENCRYPTION_MODE_OPTIONS}></Select>
        </FormItem>
        <FormItem className={styles['form-item']} name="key" label="密钥" rules={[{ validator: keyValidator }]}>
          <Input placeholder={`请输入16、24或32 bytes`} style={{ width: 240 }} />
        </FormItem>
        {options.mode === 'ECB' ? null : (
          <FormItem className={styles['form-item']} name="iv" label="偏移量" rules={[{ validator: ivValidator }]}>
            <Input
              placeholder={options.mode === 'CTR' ? '请输入 0～15 bytes,建议8 bytes' : '请输入16 bytes'}
              style={{ width: 240 }}
            />
          </FormItem>
        )}

        <FormItem className={styles['form-item']} name="padding" label="填充">
          <Select style={{ width: 160 }} showSearch options={ENCRYPTION_PADDING_OPTIONS}></Select>
        </FormItem>
      </Fragment>
    );
  }, [options]);

  const renderDesOptions = useMemo(() => {
    const keyValidator = (_: any, value: string) => {
      if (!value) return Promise.reject(new Error('请输入密钥'));
      if (value.length !== 8) {
        return Promise.reject(new Error('密钥格式错误'));
      }
      return Promise.resolve();
    };

    const ivValidator = (_: any, value: string) => {
      if (!value) return Promise.reject(new Error('请输入偏移量'));
      if (options.mode === 'CTR') {
        if (value.length < 1 && value.length > 7) {
          return Promise.reject(new Error('偏移量格式错误'));
        }
      } else {
        if (value.length !== 8) {
          return Promise.reject(new Error('偏移量格式错误'));
        }
      }
      return Promise.resolve();
    };

    return (
      <Fragment>
        <FormItem className={styles['form-item']} name="mode" label="模式">
          <Select style={{ width: 100 }} showSearch options={ENCRYPTION_MODE_OPTIONS}></Select>
        </FormItem>
        <FormItem className={styles['form-item']} name="key" label="密钥" rules={[{ validator: keyValidator }]}>
          <Input placeholder={`请输入8 bytes`} style={{ width: 240 }} />
        </FormItem>
        {options.mode === 'ECB' ? null : (
          <FormItem className={styles['form-item']} name="iv" label="偏移量" rules={[{ validator: ivValidator }]}>
            <Input
              placeholder={options.mode === 'CTR' ? '请输入 0～7 bytes' : '请输入8 bytes'}
              style={{ width: 240 }}
            />
          </FormItem>
        )}
        <FormItem className={styles['form-item']} name="padding" label="填充">
          <Select style={{ width: 160 }} showSearch options={ENCRYPTION_PADDING_OPTIONS}></Select>
        </FormItem>
      </Fragment>
    );
  }, [options]);

  const render3DesOptions = useMemo(() => {
    const keyValidator = (_: any, value: string) => {
      if (!value) return Promise.reject(new Error('请输入密钥'));
      if (![16, 24].includes(value.length)) {
        return Promise.reject(new Error('密钥格式错误'));
      }
      return Promise.resolve();
    };

    const ivValidator = (_: any, value: string) => {
      if (!value) return Promise.reject(new Error('请输入偏移量'));
      if (options.mode === 'CTR') {
        if (value.length < 1 && value.length > 7) {
          return Promise.reject(new Error('偏移量格式错误'));
        }
      } else {
        if (value.length !== 8) {
          return Promise.reject(new Error('偏移量格式错误'));
        }
      }
      return Promise.resolve();
    };

    return (
      <Fragment>
        <FormItem className={styles['form-item']} name="mode" label="模式">
          <Select style={{ width: 100 }} showSearch options={ENCRYPTION_MODE_OPTIONS}></Select>
        </FormItem>
        <FormItem className={styles['form-item']} name="key" label="密钥" rules={[{ validator: keyValidator }]}>
          <Input placeholder={`请输入8 bytes`} style={{ width: 240 }} />
        </FormItem>
        {options.mode === 'ECB' ? null : (
          <FormItem className={styles['form-item']} name="iv" label="偏移量" rules={[{ validator: ivValidator }]}>
            <Input
              placeholder={options.mode === 'CTR' ? '请输入 0～7 bytes' : '请输入8 bytes'}
              style={{ width: 240 }}
            />
          </FormItem>
        )}
        <FormItem className={styles['form-item']} name="padding" label="填充">
          <Select style={{ width: 160 }} showSearch options={ENCRYPTION_PADDING_OPTIONS}></Select>
        </FormItem>
      </Fragment>
    );
  }, [options]);

  const renderRC4Options = useMemo(() => {
    const keyValidator = (_: any, value: string) => {
      if (!value) return Promise.reject(new Error('请输入密钥'));
      if (value.length < 5 || value.length > 256) {
        return Promise.reject(new Error('密钥格式错误'));
      }
      return Promise.resolve();
    };

    return (
      <Fragment>
        <FormItem className={styles['form-item']} name="key" label="密钥" rules={[{ validator: keyValidator }]}>
          <Input placeholder={`请输入5~256 bytes,建议16 bytes`} style={{ width: 240 }} />
        </FormItem>
      </Fragment>
    );
  }, [options]);

  const renderOptions = () => {
    if (options.algorithm === 'AES') return renderAesOptions;
    if (options.algorithm === 'DES') return renderDesOptions;
    if (options.algorithm === '3DES') return render3DesOptions;
    if (options.algorithm === 'RC4') return renderRC4Options;
    return [];
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
          <FormItem className={styles['form-item']} name="algorithm" label="算法">
            <Select style={{ width: 100 }} showSearch options={ENCRYPTION_ALGORITHM_OPTIONS}></Select>
          </FormItem>
          {renderOptions()}
          <FormItem className={styles['form-item']} name="format" label="格式">
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
