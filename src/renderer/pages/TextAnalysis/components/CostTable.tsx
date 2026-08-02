/**
 * 可编辑成本估算表：antd Table 内嵌 Input/Select/InputNumber + useLocalData 持久化
 */
import { Button, Checkbox, Input, InputNumber, Select, Table, Tooltip } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import Icon from '@/renderer/components/Icon';
import { useLocalData } from '@/renderer/hooks';
import { ALL_ENCODINGS, CURRENCY_SYMBOL, DEFAULT_PRICE_TABLE } from '../constants';
import { IPriceRow, TCurrency, TEncodingName } from '../types';

interface IProps {
  /** 各编码下的输入 token 数（由 TokenTab 批量计算后传入） */
  tokenCountByEncoding: Partial<Record<TEncodingName, number>>;
}

const LOCAL_DATA_KEY = 'text_analysis_price_table';

// 生成新行 id
const genRowId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const CostTable = ({ tokenCountByEncoding }: IProps) => {
  const { data: localData, setData: setLocalData } = useLocalData();
  const savedRows = localData?.[LOCAL_DATA_KEY] as IPriceRow[] | undefined;

  const [rows, setRows] = useState<IPriceRow[]>(DEFAULT_PRICE_TABLE);
  // 预估输出 tokens 与"输出=输入"开关
  const [estimateOutputTokens, setEstimateOutputTokens] = useState<number>(0);
  const [outputEqualsInput, setOutputEqualsInput] = useState<boolean>(true);

  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 本地配置加载完成后同步（electron-store 异步读取）
  useEffect(() => {
    if (savedRows && savedRows !== rows) {
      setRows(savedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localData]);

  // 更新行并防抖持久化
  const updateRows = (newRows: IPriceRow[]) => {
    setRows(newRows);
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      setLocalData({ [LOCAL_DATA_KEY]: newRows });
    }, 500);
  };

  const updateRow = (id: string, patch: Partial<IPriceRow>) => {
    updateRows(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const handleAddRow = () => {
    const newRow: IPriceRow = {
      id: genRowId(),
      model: '新模型',
      encoding: 'o200k_base',
      inputPrice: 0,
      outputPrice: 0,
      currency: 'USD',
    };
    updateRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    updateRows(rows.filter((row) => row.id !== id));
  };

  const columns = useMemo(() => {
    return [
      {
        title: '模型',
        dataIndex: 'model',
        key: 'model',
        width: 180,
        render: (_: unknown, row: IPriceRow) => (
          <Input
            size="small"
            defaultValue={row.model}
            onBlur={(e) => updateRow(row.id, { model: e.target.value })}
          />
        ),
      },
      {
        title: '编码',
        dataIndex: 'encoding',
        key: 'encoding',
        width: 140,
        render: (_: unknown, row: IPriceRow) => (
          <Select
            size="small"
            style={{ width: '100%' }}
            value={row.encoding}
            onChange={(encoding: TEncodingName) => updateRow(row.id, { encoding })}
            options={ALL_ENCODINGS.map((encoding) => ({ label: encoding, value: encoding }))}
          />
        ),
      },
      {
        title: '输入单价($/1M)',
        dataIndex: 'inputPrice',
        key: 'inputPrice',
        width: 130,
        render: (_: unknown, row: IPriceRow) => (
          <InputNumber
            size="small"
            style={{ width: '100%' }}
            min={0}
            step={0.01}
            precision={4}
            value={row.inputPrice}
            onChange={(value: number | null) => updateRow(row.id, { inputPrice: value ?? 0 })}
          />
        ),
      },
      {
        title: '输出单价($/1M)',
        dataIndex: 'outputPrice',
        key: 'outputPrice',
        width: 130,
        render: (_: unknown, row: IPriceRow) => (
          <InputNumber
            size="small"
            style={{ width: '100%' }}
            min={0}
            step={0.01}
            precision={4}
            value={row.outputPrice}
            onChange={(value: number | null) => updateRow(row.id, { outputPrice: value ?? 0 })}
          />
        ),
      },
      {
        title: '币种',
        dataIndex: 'currency',
        key: 'currency',
        width: 90,
        render: (_: unknown, row: IPriceRow) => (
          <Select
            size="small"
            style={{ width: '100%' }}
            value={row.currency}
            onChange={(currency: TCurrency) => updateRow(row.id, { currency })}
            options={[
              { label: 'USD', value: 'USD' },
              { label: 'CNY', value: 'CNY' },
            ]}
          />
        ),
      },
      {
        title: '输入 tokens',
        key: 'inputTokens',
        width: 110,
        render: (_: unknown, row: IPriceRow) => (
          <span>{tokenCountByEncoding[row.encoding] ?? 0}</span>
        ),
      },
      {
        title: '输出 tokens',
        key: 'outputTokens',
        width: 110,
        render: (_: unknown, row: IPriceRow) => {
          const inputTokens = tokenCountByEncoding[row.encoding] ?? 0;
          return <span>{outputEqualsInput ? inputTokens : estimateOutputTokens}</span>;
        },
      },
      {
        title: '预估成本',
        key: 'cost',
        width: 130,
        render: (_: unknown, row: IPriceRow) => {
          const inputTokens = tokenCountByEncoding[row.encoding] ?? 0;
          const outputTokens = outputEqualsInput ? inputTokens : estimateOutputTokens;
          const cost = (inputTokens * row.inputPrice) / 1e6 + (outputTokens * row.outputPrice) / 1e6;
          return (
            <span>
              {CURRENCY_SYMBOL[row.currency]}
              {cost.toFixed(4)}
            </span>
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 60,
        render: (_: unknown, row: IPriceRow) => (
          <Tooltip title="删除">
            <Icon type="icon-delete" size={16} onClick={() => handleDeleteRow(row.id)} />
          </Tooltip>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, tokenCountByEncoding, outputEqualsInput, estimateOutputTokens]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0' }}>
        <Button size="small" type="primary" onClick={handleAddRow}>
          添加一行
        </Button>
        <span style={{ fontSize: 12, color: '#666' }}>预估输出 tokens：</span>
        <InputNumber
          size="small"
          min={0}
          step={100}
          disabled={outputEqualsInput}
          value={estimateOutputTokens}
          onChange={(value: number | null) => setEstimateOutputTokens(value ?? 0)}
        />
        <Checkbox checked={outputEqualsInput} onChange={(e) => setOutputEqualsInput(e.target.checked)}>
          输出=输入
        </Checkbox>
      </div>
      <Table
        size="small"
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        columns={columns}
        dataSource={rows}
      />
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        提示：单价按每 100 万 tokens 计；默认价格仅供参考，请以各模型官方最新定价为准，可在表格内直接修改并自动保存。
      </div>
    </div>
  );
};

export default CostTable;
