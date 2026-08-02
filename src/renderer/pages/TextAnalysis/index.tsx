/**
 * 文本分析：顶部共享输入区 + 三个分析 tab（Token 计算 / 文本统计 / 词频分析）
 */
import { useState } from 'react';

import CustomTabs from '@/renderer/components/CustomTabs';
import InputPanel from './components/InputPanel';
import TokenTab from './components/TokenTab';
import StatsTab from './components/StatsTab';
import WordFrequencyTab from './components/WordFrequencyTab';
import styles from './index.module.less';

const TextAnalysis = () => {
  const [text, setText] = useState<string>('');

  return (
    <div className={styles['text-analysis']}>
      <InputPanel value={text} onChange={setText} />
      <div className={styles['text-analysis-tabs']}>
        <CustomTabs
          items={[
            {
              label: 'Token 计算',
              key: 'token',
              children: <TokenTab text={text} />,
            },
            {
              label: '文本统计',
              key: 'stats',
              children: <StatsTab text={text} />,
            },
            {
              label: '词频分析',
              key: 'freq',
              children: <WordFrequencyTab text={text} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TextAnalysis;
