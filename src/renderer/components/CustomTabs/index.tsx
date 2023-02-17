import React, { memo, useState } from 'react';
import { Tabs, Radio } from 'antd';

export interface ICustomTabItem {
  label: string;
  key: string;
  children: React.ReactNode;
}

export interface IProps {
  items: ICustomTabItem[];
}

const JsonComponent = (props: IProps) => {
  const { items } = props;
  if (items?.length === 0) return null;

  const [activeKey, setActiveKey] = useState(items[0].key);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
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
