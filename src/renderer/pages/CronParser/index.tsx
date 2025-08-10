import React, { useState, useEffect } from 'react';
import { Input, Form, Typography, Table, Tag, Dropdown, Alert, Space, List, Tooltip, Button, Flex } from 'antd';
import { CheckOutlined, CloseOutlined, FileSearchOutlined, CaretDownOutlined } from '@ant-design/icons';
import { CronExpressionParser } from 'cron-parser';
import { dayjs } from '@fett/utils';

import CheatSheet from './CheatSheet';
import { cronFields, CronField } from './constants';

const { Text } = Typography;

// Cron解析结果模型
interface CronParseResult {
  valid: boolean;
  error?: string;
  fields: CronField[];
  humanReadable: string;
}

const CronParser: React.FC = () => {
  const [cronExpression, setCronExpression] = useState<string>('0 0 * * *');
  const [parseResult, setParseResult] = useState<CronParseResult>({
    valid: true,
    fields: [],
    humanReadable: '',
  });
  const [nextExecutions, setNextExecutions] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);

  // 解析Cron表达式
  const parseCron = (expression: string): CronParseResult => {
    // 清除空白字符
    const cleaned = expression.trim();
    if (!cleaned) {
      return {
        valid: false,
        error: 'Cron表达式不能为空',
        fields: [...cronFields],
        humanReadable: '',
      };
    }

    // 分割字段（支持5、6或7个字段的Cron表达式）
    const parts = cleaned.split(/\s+/);
    let resultFields = [...cronFields];

    // 验证字段数量
    if (parts.length < 5 || parts.length > 7) {
      return {
        valid: false,
        error: `无效的字段数量，Cron表达式应包含5-7个字段，实际为${parts.length}个`,
        fields: resultFields,
        humanReadable: '',
      };
    }

    // 处理不同长度的表达式（补全7个字段）
    const normalizedParts = [...parts];
    if (parts.length === 5) {
      normalizedParts.unshift('0'); // 添加秒字段
      normalizedParts.push('*'); // 添加年字段
    } else if (parts.length === 6) {
      // 判断6字段表达式是缺少秒还是年
      // 简单判断：如果第一个字段超过59，则认为缺少秒
      const firstFieldNum = parseInt(normalizedParts[0], 10);
      if (!isNaN(firstFieldNum) && firstFieldNum > 59) {
        normalizedParts.unshift('0'); // 添加秒字段
      } else {
        normalizedParts.push('*'); // 添加年字段
      }
    }

    // 解析每个字段
    let isValid = true;
    const fieldConstraints = [
      { min: 0, max: 59, name: '秒' }, // 秒
      { min: 0, max: 59, name: '分' }, // 分
      { min: 0, max: 23, name: '时' }, // 时
      { min: 1, max: 31, name: '日' }, // 日
      {
        min: 1,
        max: 12,
        name: '月',
        aliases: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      }, // 月
      { min: 0, max: 6, name: '周', aliases: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] }, // 周
      { min: 1970, max: 2099, name: '年' }, // 年
    ];

    normalizedParts.forEach((part, index) => {
      const field = { ...resultFields[index] };
      field.value = part;

      // 解析当前字段
      const { parsed, valid, error } = parseCronField(
        part,
        fieldConstraints[index].min,
        fieldConstraints[index].max,
        fieldConstraints[index].aliases,
      );

      field.parsed = parsed;
      field.valid = valid;
      field.error = error;

      if (!valid) isValid = false;
      resultFields[index] = field;
    });

    // 生成人类可读的描述
    const humanReadable = generateHumanReadable(resultFields);

    return {
      valid: isValid,
      fields: resultFields,
      humanReadable: isValid ? humanReadable : '解析失败，无法生成可读描述',
    };
  };

  // 解析单个Cron字段
  const parseCronField = (
    value: string,
    min: number,
    max: number,
    aliases?: string[],
  ): { parsed: string; valid: boolean; error?: string } => {
    // 空值处理
    if (!value) {
      return { parsed: '', valid: false, error: '字段不能为空' };
    }

    // 处理通配符
    if (value === '*') {
      return { parsed: `每${min === 0 && max === 59 ? '一' : ''}个${min}-${max}之间的数值`, valid: true };
    }

    // 处理问号（仅用于日和周字段）
    if (value === '?') {
      return { parsed: '不指定值', valid: true };
    }

    // 处理别名（月和周）
    if (aliases && /[A-Za-z]/.test(value)) {
      const aliasMap = new Map<string, number>();
      aliases.forEach((alias, idx) => {
        aliasMap.set(alias, min + idx);
        aliasMap.set(alias.toLowerCase(), min + idx);
      });

      // 替换别名
      let processedValue = value;
      aliasMap.forEach((num, alias) => {
        processedValue = processedValue.replace(new RegExp(alias, 'g'), num.toString());
      });

      // 如果还有字母，说明是无效别名
      if (/[A-Za-z]/.test(processedValue)) {
        return {
          parsed: '',
          valid: false,
          error: `包含无效别名，允许的别名: ${aliases.join(', ')}`,
        };
      }

      value = processedValue;
    }

    // 处理步长（*/n 或 x-y/n）
    if (value.includes('/')) {
      const [rangePart, stepPart] = value.split('/');
      const step = parseInt(stepPart, 10);

      if (isNaN(step) || step <= 0) {
        return { parsed: '', valid: false, error: '步长必须是正整数' };
      }

      let rangeParsed = '';
      if (rangePart === '*') {
        rangeParsed = `从${min}到${max}，每${step}个`;
      } else if (rangePart.includes('-')) {
        const [start, end] = rangePart.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
          return { parsed: '', valid: false, error: `无效的范围，必须在${min}-${max}之间` };
        }
        rangeParsed = `从${start}到${end}，每${step}个`;
      } else {
        const start = parseInt(rangePart, 10);
        if (isNaN(start) || start < min || start > max) {
          return { parsed: '', valid: false, error: `值必须在${min}-${max}之间` };
        }
        rangeParsed = `从${start}开始，每${step}个，直到${max}`;
      }

      return { parsed: rangeParsed, valid: true };
    }

    // 处理范围（x-y）
    if (value.includes('-')) {
      const [start, end] = value.split('-').map(Number);
      if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
        return { parsed: '', valid: false, error: `无效的范围，必须在${min}-${max}之间` };
      }
      return { parsed: `从${start}到${end}`, valid: true };
    }

    // 处理列表（x,y,z）
    if (value.includes(',')) {
      const items = value.split(',').map(Number);
      for (const item of items) {
        if (isNaN(item) || item < min || item > max) {
          return { parsed: '', valid: false, error: `列表中包含无效值，必须在${min}-${max}之间` };
        }
      }
      return { parsed: `值为${items.join('、')}`, valid: true };
    }

    // 处理单个数值
    const num = parseInt(value, 10);
    if (isNaN(num) || num < min || num > max) {
      return { parsed: '', valid: false, error: `值必须在${min}-${max}之间` };
    }
    return { parsed: `值为${num}`, valid: true };
  };

  const handleGenNextExecutions = (cron?: string) => {
    if (!cron || !parseResult.valid) {
      return;
    }
    try {
      setCurrentTime(new Date().toLocaleString());
      const data = CronExpressionParser.parse(cron || cronExpression, {
        tz: 'Asia/Shanghai',
        currentDate: new Date(),
      });
      const times = 10;
      const results = [];
      for (let i = 0; i < times; i++) {
        results.push(data.next().toString());
      }
      setNextExecutions(results);
    } catch (e) {
      setNextExecutions([]);
    }
  };

  // 生成人类可读的描述
  const generateHumanReadable = (fields: CronField[]): string => {
    const [second, minute, hour, day, month, week, year] = fields;

    // 处理年份
    const yearDesc =
      year.value === '*' || !year.value ? '每年' : year.value === '?' ? '' : `在${year.parsed.replace('值为', '')}年`;

    // 处理月份
    const monthDesc =
      month.value === '*' ? '每月' : month.parsed.replace('值为', '在').replace('从', '从').replace('每一个', '每个');

    // 处理日期和星期（需要特殊处理，因为它们可能互斥）
    let dayDesc = '';
    if (day.value !== '?' && day.value !== '*') {
      dayDesc = day.parsed.replace('值为', '每月的第').replace('从', '每月从第');
    }

    let weekDesc = '';
    if (week.value !== '?' && week.value !== '*') {
      const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
      weekDesc = week.parsed
        .replace(/值为(\d+)/g, (_, num) => `每周${weekMap[parseInt(num, 10)]}`)
        .replace(
          /从(\d+)到(\d+)/g,
          (_, start, end) => `每周从${weekMap[parseInt(start, 10)]}到${weekMap[parseInt(end, 10)]}`,
        );
    }

    // 处理小时
    const hourDesc =
      hour.value === '*' ? '每小时' : hour.parsed.replace('值为', '在').replace('从', '从').replace('每一个', '每个');

    // 处理分钟
    const minuteDesc =
      minute.value === '*'
        ? '每分钟'
        : minute.parsed.replace('值为', '在').replace('从', '从').replace('每一个', '每个');

    // 处理秒
    const secondDesc =
      second.value === '*' ? '0秒' : second.parsed.replace('值为', '在').replace('从', '从').replace('每一个', '每个');

    // 组合描述（根据实际情况调整顺序和连接词）
    const parts = [yearDesc, monthDesc];
    if (dayDesc) parts.push(dayDesc);
    if (weekDesc) parts.push(weekDesc);
    parts.push(`${hourDesc}${minuteDesc}${secondDesc}`);

    // 过滤空值并连接
    return parts.filter(Boolean).join('，') + '执行';
  };

  // 当表达式变化时解析
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsParsing(true);
      handleGenNextExecutions(cronExpression);
      const result = parseCron(cronExpression);
      setParseResult(result);
      setIsParsing(false);
    }, 500); // 延迟解析，避免输入过程中频繁解析

    return () => clearTimeout(timer);
  }, [cronExpression]);

  // 表格列定义
  const columns = [
    {
      title: '域',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
      render: (text: string, record: CronField) => (
        <Tooltip title={record.description}>
          <Text strong>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      width: '15%',
      render: (text: string, record: CronField) => <Tag color={record.valid ? 'blue' : 'red'}>{text || '-'}</Tag>,
    },
    {
      title: '解析结果',
      dataIndex: 'parsed',
      key: 'parsed',
      width: '65%',
      render: (text: string, record: CronField) => (
        <div>
          {record.valid ? (
            <span>{text}</span>
          ) : (
            <Text type="danger">
              <CloseOutlined style={{ marginRight: 4 }} />
              {record.error}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      key: 'valid',
      width: '10%',
      render: (_: any, record: CronField) =>
        record.valid ? (
          <Tag color="green" icon={<CheckOutlined />}>
            有效
          </Tag>
        ) : (
          <Tag color="red" icon={<CloseOutlined />}>
            无效
          </Tag>
        ),
    },
  ];

  return (
    <div style={{ padding: '6px 0' }}>
      <Form layout="vertical">
        <Text style={{ whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: 16, margin: '12px 0' }}>Cron表达式</Text>
        <Form.Item>
          <Flex>
            <Input
              size="large"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              placeholder="请输入Cron表达式，例如：0 0 * * * 或 0 0 12 ? * WED"
              style={{ fontSize: '16px' }}
            />
            <Dropdown trigger={['click']} popupRender={() => <CheatSheet />}>
              <Button style={{ width: 140, marginLeft: 12 }} type="primary" size="large">
                <Space>
                  <FileSearchOutlined /> 语法参考
                  <CaretDownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Flex>
        </Form.Item>

        <Form.Item label="解析结果">
          {parseResult.valid ? (
            <Alert message={parseResult.humanReadable} type="success" />
          ) : (
            <Alert message={parseResult.error || '解析失败'} type="error" />
          )}

          <Table
            style={{ marginTop: '12px' }}
            size="small"
            columns={columns}
            dataSource={parseResult.fields}
            rowKey="name"
            pagination={false}
            loading={isParsing}
            bordered
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 0 }}
          label={
            <div>
              最近10次运行时间
              <Button
                style={{ marginLeft: 8, marginRight: 8 }}
                size="small"
                onClick={() => handleGenNextExecutions(cronExpression)}
              >
                刷新
              </Button>
              当前时间：{dayjs(currentTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          }
        >
          <List
            style={{ maxHeight: 'calc(100vh - 625px)', overflow: 'auto' }}
            size="small"
            dataSource={nextExecutions}
            renderItem={(item, index) => (
              <List.Item>
                {`${index + 1}. `} {dayjs(item).format('YYYY-MM-DD HH:mm:ss')}
              </List.Item>
            )}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default CronParser;
