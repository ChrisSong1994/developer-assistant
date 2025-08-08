import { useState, useEffect } from 'react';
import { Input, Form, Select, Typography, Space, Divider, Alert } from 'antd';

import Copy from '@/renderer/components/Copy';

const { Text, Paragraph } = Typography;
const { Option } = Select;

// 进制选项配置
const BASE_OPTIONS = [
  { value: 2, label: '二进制 (Binary) ob', placeholder: '输入二进制数字 (0-1)' },
  { value: 8, label: '八进制 (Octal)', placeholder: '输入八进制数字 (0-7)' },
  { value: 10, label: '十进制 (Decimal)', placeholder: '输入十进制数字 (0-9)' },
  { value: 16, label: '十六进制 (Hexadecimal)', placeholder: '输入十六进制数字 (0-9, A-F/a-f)' },
];

const BaseConverter = () => {
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState('');
  const [inputBase, setInputBase] = useState(10);
  const [outputBases, setOutputBases] = useState([2, 8, 16]);
  const [convertedValues, setConvertedValues] = useState<Record<string, any>>({});
  const [error, setError] = useState('');

  // 验证输入是否符合当前进制规则
  const validateInput = (value: string, base: number) => {
    if (!value) return true;

    let regex;
    switch (base) {
      case 2:
        regex = /^[01]+$/;
        break;
      case 8:
        regex = /^[0-7]+$/;
        break;
      case 10:
        regex = /^[0-9]+$/;
        break;
      case 16:
        regex = /^[0-9A-Fa-f]+$/;
        break;
      default:
        return false;
    }

    return regex.test(value);
  };

  // 执行进制转换
  const convert = (value: string, fromBase: number, toBase: number) => {
    if (!value) return '';

    try {
      // 先转换为十进制，再转换为目标进制
      const decimal = parseInt(value, fromBase);
      if (isNaN(decimal)) return '';

      // 特殊处理0的情况
      if (decimal === 0) return '0';

      let result = '';
      let num = decimal;

      while (num > 0) {
        let remainder: string | number = num % toBase;

        // 十六进制处理
        if (toBase === 16) {
          if (remainder >= 10) {
            remainder = String.fromCharCode(55 + remainder); // 65是'A'的ASCII码
          }
        }

        result = remainder + result;
        num = Math.floor(num / toBase);
      }

      return result;
    } catch (err) {
      console.error('转换错误:', err);
      return '';
    }
  };

  // 当输入值或输入进制变化时，重新计算所有输出
  useEffect(() => {
    setError('');

    if (!inputValue) {
      setConvertedValues({});
      return;
    }

    // 验证输入
    if (!validateInput(inputValue, inputBase)) {
      setError(`输入不符合${BASE_OPTIONS.find((b) => b.value === inputBase)?.label}格式要求`);
      setConvertedValues({});
      return;
    }

    // 执行转换
    const newConvertedValues: Record<string, any> = {};
    outputBases.forEach((base) => {
      newConvertedValues[base] = convert(inputValue, inputBase, base);
    });

    setConvertedValues(newConvertedValues);
  }, [inputValue, inputBase, outputBases]);

  // 处理输入变化
  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
  };

  // 处理输入进制变化
  const handleBaseChange = (value: number) => {
    // 移除输出进制中与输入进制相同的选项
    const newOutputBases = BASE_OPTIONS.map((b) => b.value).filter((b) => b !== value);

    setInputBase(value);
    setOutputBases(newOutputBases);
  };

  return (
    <div style={{ maxWidth: '90%', margin: '0 auto', padding: '20px' }}>
      <Form form={form} layout="vertical">
        <Text style={{ whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: 16, margin: '10px 0' }}>输入值</Text>
        <Form.Item>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              size="large"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={BASE_OPTIONS.find((b) => b.value === inputBase)?.placeholder}
              style={{ flex: 1 }}
            />
            <Select size="large" value={inputBase} onChange={handleBaseChange} style={{ width: 180 }}>
              {BASE_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Space.Compact>
        </Form.Item>

        {error && <Alert message="输入错误" description={error} type="error" showIcon style={{ marginBottom: 20 }} />}

        <Divider>转换结果</Divider>

        {/* 输出区域 */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {outputBases.map((base) => {
            const baseInfo = BASE_OPTIONS.find((b) => b.value === base);
            return (
              <Input
                key={base}
                size="large"
                value={convertedValues[base] || ''}
                readOnly
                addonBefore={baseInfo?.label}
                placeholder="转换结果"
                style={{ width: '100%' }}
                suffix={<Copy value={convertedValues[base]} />}
              />
            );
          })}
        </Space>
      </Form>

      <Divider style={{ marginTop: 20 }} />

      {/* 进制说明 */}
      <Paragraph>
        <Text strong>进制说明：</Text>
      </Paragraph>
      <Space direction="vertical" size="small">
        <Text>• 二进制：由0和1组成，计算机底层使用的数字系统</Text>
        <Text>• 八进制：由0-7组成，常用于早期计算机系统</Text>
        <Text>• 十进制：由0-9组成，日常使用的数字系统</Text>
        <Text>• 十六进制：由0-9和A-F（或a-f）组成，常用于编程和数字表示</Text>
      </Space>
    </div>
  );
};

export default BaseConverter;
