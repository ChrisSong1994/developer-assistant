import { Radio, Tabs } from 'antd';
import React, { Fragment, memo, useState } from 'react';

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
    <Fragment>
      <div style={{ textAlign: 'center', ...tabStyle }}>
        <Radio.Group buttonStyle="solid" value={activeKey} onChange={(e) => setActiveKey(e.target.value)}>
          {items.map((item) => (
            <Radio.Button style={{ height: '28px', lineHeight: '26px' }} key={item.key} value={item.key}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <Tabs activeKey={activeKey} items={items} />
    </Fragment>
  );
};

export default memo(JsonComponent);
