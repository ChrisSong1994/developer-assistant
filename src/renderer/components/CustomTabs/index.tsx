import { Radio, Tabs } from 'antd';
import React, { memo, useState } from 'react';

export interface ICustomTabItem {
  label: string;
  key: string;
  children: React.ReactNode;
}

export interface IProps {
  items: ICustomTabItem[];
  tabStyle?: Record<string, any>;
}

const JsonComponent = (props: IProps) => {
  const { items, tabStyle = {} } = props;
  if (items?.length === 0) return null;

  const [activeKey, setActiveKey] = useState(items[0].key);

  return (
    <div>
      <div style={{ textAlign: 'center', ...tabStyle }}>
        <Radio.Group buttonStyle="solid" value={activeKey} onChange={(e) => setActiveKey(e.target.value)}>
          {items.map((item) => (
            <Radio.Button key={item.key} value={item.key}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <Tabs activeKey={activeKey} items={items} />
    </div>
  );
};

export default memo(JsonComponent);
