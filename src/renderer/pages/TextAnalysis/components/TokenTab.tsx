/**
 * Token 计算 tab：编码/模型切换、token 数卡片、token 分布、token 预览
 */
import { Select, Statistic, Table, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { ENCODING_MODEL_OPTIONS } from '../constants';
import { TEncodingName } from '../types';
import { tokenLengthDistribution, tokenizeWithDetails } from '../utils/tokenize';
import type { ITokenizeResult } from '../utils/tokenize';
import BarChart from './BarChart';

interface IProps {
  text: string;
}

const TokenTab = ({ text }: IProps) => {
  const [encoding, setEncoding] = useState<TEncodingName>('o200k_base');
  const [result, setResult] = useState<ITokenizeResult>({ total: 0, details: [] });
  const [distribution, setDistribution] = useState<Array<{ label: string; value: number }>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 当前编码：token 化 + 长度分布
  useEffect(() => {
    let cancelled = false;
    if (!text) {
      setResult({ total: 0, details: [] });
      setDistribution([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // 让出主线程，避免大文本阻塞 UI
    const timer = setTimeout(() => {
      tokenizeWithDetails(text, encoding)
        .then((res) => {
          if (!cancelled) setResult(res);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      tokenLengthDistribution(text, encoding).then((dist) => {
        if (!cancelled) setDistribution(dist);
      });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, encoding]);

  const charCount = useMemo(() => text.length, [text]);
  const tokenDensity = useMemo(() => {
    if (!result.total) return 0;
    return (result.total / Math.max(charCount, 1)).toFixed(2);
  }, [result.total, charCount]);

  const previewColumns = useMemo(
    () => [
      { title: '序号', key: 'index', width: 70, render: (_: unknown, __: unknown, index: number) => index + 1 },
      { title: 'Token ID', dataIndex: 'id', key: 'id', width: 110 },
      {
        title: '文本',
        dataIndex: 'text',
        key: 'text',
        ellipsis: true,
        render: (value: string) => <span style={{ whiteSpace: 'pre-wrap' }}>{value === '\n' ? '\\n' : value}</span>,
      },
    ],
    [],
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>编码/模型：</span>
        <Select
          style={{ width: 360 }}
          showSearch
          value={encoding}
          onChange={setEncoding}
          options={Object.values(
            ENCODING_MODEL_OPTIONS.reduce<Record<string, any>>((acc, item) => {
              const group = item.group;
              if (!acc[group]) acc[group] = { label: group, options: [] };
              acc[group].options.push({ label: item.label, value: item.value });
              return acc;
            }, {}),
          )}
        />
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: 32, margin: '12px 0' }}>
        <Statistic title="Token 数" value={result.total} loading={loading} />
        <Statistic title="字符数" value={charCount} />
        <Statistic title="Token/字符" value={tokenDensity} />
        <Statistic title="编码" value={encoding} />
      </div>

      {/* token 长度分布 */}
      {distribution.length > 0 ? (
        <div style={{ margin: '8px 0' }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 8 }}>
            Token 长度分布（按解码后字符数）
            {result.total > 10000 ? <span style={{ color: '#999', fontSize: 12 }}>（基于前 10000 个 token）</span> : null}
          </div>
          <BarChart data={distribution} height={160} />
        </div>
      ) : null}

      {/* token 预览 */}
      <div style={{ margin: '8px 0' }}>
        <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 8 }}>
          Token 预览
          {result.total > result.details.length ? (
            <Tooltip title={`共 ${result.total} 个 token，仅展示前 ${result.details.length} 个`}>
              <span style={{ color: '#999', fontSize: 12, marginLeft: 8 }}>
                （共 {result.total} 个，仅展示前 {result.details.length} 个）
              </span>
            </Tooltip>
          ) : null}
        </div>
        <Table
          size="small"
          pagination={false}
          scroll={{ y: 220 }}
          rowKey="id"
          columns={previewColumns}
          dataSource={result.details}
        />
      </div>
    </div>
  );
};

export default TokenTab;
