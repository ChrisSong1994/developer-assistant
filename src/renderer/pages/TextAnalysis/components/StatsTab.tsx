/**
 * 文本统计 tab：字符/词/行/段/句/字节/熵/阅读时长/hash 指纹
 */
import { Descriptions, Row, Col, Statistic } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import Copy from '@/renderer/components/Copy';
import { ITextStats } from '../types';
import { computeFingerprints, computeStats } from '../utils/stats';

interface IProps {
  text: string;
}

// 阅读时长格式化
const formatReadTime = (seconds: number): string => {
  if (!seconds) return '0 秒';
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  if (!minutes) return `${rest} 秒`;
  return `${minutes} 分 ${rest} 秒`;
};

const StatsTab = ({ text }: IProps) => {
  const stats = useMemo(() => computeStats(text), [text]);
  const [fingerprints, setFingerprints] = useState<Pick<ITextStats, 'md5' | 'sha1' | 'sha256'>>({
    md5: '',
    sha1: '',
    sha256: '',
  });

  useEffect(() => {
    let cancelled = false;
    if (!text) {
      setFingerprints({ md5: '', sha1: '', sha256: '' });
      return;
    }
    computeFingerprints(text).then((res) => {
      if (!cancelled) setFingerprints(res);
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

  const hashItems = useMemo(
    () =>
      [
        { key: 'md5', label: 'MD5', value: fingerprints.md5 },
        { key: 'sha1', label: 'SHA1', value: fingerprints.sha1 },
        { key: 'sha256', label: 'SHA256', value: fingerprints.sha256 },
      ].map((item) => ({
        key: item.key,
        label: item.label,
        children: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {item.value || '-'}
            {item.value ? <Copy value={item.value} size={16} /> : null}
          </span>
        ),
      })),
    [fingerprints],
  );

  return (
    <div>
      {/* 核心统计卡片 */}
      <Row gutter={[16, 16]} style={{ margin: '12px 0' }}>
        <Col span={4}>
          <Statistic title="总字符数" value={stats.charCount} />
        </Col>
        <Col span={4}>
          <Statistic title="总词数" value={stats.wordCount} />
        </Col>
        <Col span={4}>
          <Statistic title="中文字符" value={stats.cjkCount} />
        </Col>
        <Col span={4}>
          <Statistic title="UTF-8 字节" value={stats.utf8Bytes} />
        </Col>
        <Col span={4}>
          <Statistic title="信息熵" value={stats.entropy.toFixed(2)} suffix="bit" />
        </Col>
        <Col span={4}>
          <Statistic title="阅读时长" value={formatReadTime(stats.readSeconds)} />
        </Col>
      </Row>

      {/* 详细统计 */}
      <Descriptions
        bordered
        size="small"
        column={4}
        style={{ margin: '12px 0' }}
        items={[
          { key: 'charCountNoSpace', label: '字符数(去空白)', children: stats.charCountNoSpace },
          { key: 'letterCount', label: '英文字母', children: stats.letterCount },
          { key: 'digitCount', label: '数字', children: stats.digitCount },
          { key: 'punctuationCount', label: '标点符号', children: stats.punctuationCount },
          { key: 'whitespaceCount', label: '空白字符', children: stats.whitespaceCount },
          { key: 'latinWordCount', label: '英文词数', children: stats.latinWordCount },
          { key: 'cjkBlockCount', label: '中文词组数', children: stats.cjkBlockCount },
          { key: 'uniqueWordCount', label: '词种数', children: stats.uniqueWordCount },
          { key: 'lineCount', label: '行数', children: stats.lineCount },
          { key: 'paragraphCount', label: '段落数', children: stats.paragraphCount },
          { key: 'sentenceCount', label: '句子数', children: stats.sentenceCount },
          { key: 'readMinutes', label: '阅读时长(分)', children: stats.readMinutes.toFixed(1) },
        ]}
      />

      {/* hash 指纹 */}
      <Descriptions
        bordered
        size="small"
        column={1}
        style={{ margin: '12px 0' }}
        title="内容指纹"
        items={hashItems}
      />
    </div>
  );
};

export default StatsTab;
