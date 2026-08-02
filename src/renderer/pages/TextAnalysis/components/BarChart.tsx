/**
 * 零依赖 CSS 条形图
 */
import { memo } from 'react';
import styles from './BarChart.module.less';

export interface IBarChartItem {
  label: string;
  value: number;
}

export interface IBarChartProps {
  data: IBarChartItem[];
  /** 条宽基准最大值（默认取 data 最大值，多图对比时可固定） */
  max?: number;
  /** 容器高度，默认 320，超长自动内部滚动 */
  height?: number;
  /** 条色，默认主题色 */
  barColor?: string;
  /** 数值格式化，默认原样 */
  formatter?: (value: number) => string;
  /** 是否显示条尾数值，默认 true */
  showValue?: boolean;
  /** 空数据显示文案 */
  emptyText?: string;
}

const BarChart = ({
  data,
  max,
  height = 320,
  barColor,
  formatter,
  showValue = true,
  emptyText = '暂无数据',
}: IBarChartProps) => {
  const maxValue = max ?? Math.max(...data.map((item) => item.value), 1);

  if (!data.length) {
    return <div className={styles['bar-chart-empty']}>{emptyText}</div>;
  }

  return (
    <div className={styles['bar-chart']} style={{ maxHeight: height }}>
      {data.map((item) => {
        const percent = Math.max((item.value / maxValue) * 100, 0.5);
        return (
          <div className={styles['bar-row']} key={`${item.label}-${item.value}`}>
            <div className={styles['bar-label']} title={item.label}>
              {item.label}
            </div>
            <div className={styles['bar-track']}>
              <div
                className={styles['bar-fill']}
                style={{ width: `${percent}%`, backgroundColor: barColor }}
              ></div>
            </div>
            {showValue ? (
              <div className={styles['bar-value']}>{formatter ? formatter(item.value) : item.value}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default memo(BarChart);
