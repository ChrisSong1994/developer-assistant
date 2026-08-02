/**
 * 词频分析 tab：高频词/高频汉字 Top-N + 条形图
 */
import { Checkbox, InputNumber, Select } from 'antd';
import { useMemo, useState } from 'react';

import { IFrequencyParams } from '../types';
import { analyzeFrequency } from '../utils/wordFrequency';
import BarChart from './BarChart';

interface IProps {
  text: string;
}

const DEFAULT_PARAMS: IFrequencyParams = {
  topN: 20,
  minLength: 1,
  filterStopWords: true,
};

const WordFrequencyTab = ({ text }: IProps) => {
  const [params, setParams] = useState<IFrequencyParams>(DEFAULT_PARAMS);

  const result = useMemo(() => analyzeFrequency(text, params), [text, params]);

  const wordData = useMemo(() => result.words.map((item) => ({ label: item.text, value: item.count })), [result]);
  const hanziData = useMemo(() => result.hanzi.map((item) => ({ label: item.text, value: item.count })), [result]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0' }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>Top-N：</span>
        <Select
          style={{ width: 90 }}
          value={params.topN}
          onChange={(topN: number) => setParams({ ...params, topN })}
          options={[10, 20, 50, 100].map((n) => ({ label: n, value: n }))}
        />
        <span style={{ fontWeight: 500, fontSize: 14 }}>最小词长：</span>
        <InputNumber
          min={1}
          max={10}
          value={params.minLength}
          onChange={(minLength: number | null) => setParams({ ...params, minLength: minLength ?? 1 })}
        />
        <Checkbox
          checked={params.filterStopWords}
          onChange={(e) => setParams({ ...params, filterStopWords: e.target.checked })}
        >
          过滤停用词
        </Checkbox>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 8 }}>高频词 Top-{params.topN}</div>
          <BarChart data={wordData} emptyText="暂无词频数据，请在输入区输入文本" />
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 8 }}>高频汉字 Top-{params.topN}</div>
          <BarChart data={hanziData} emptyText="暂无汉字数据，请在输入区输入中文文本" />
        </div>
      </div>
    </div>
  );
};

export default WordFrequencyTab;
