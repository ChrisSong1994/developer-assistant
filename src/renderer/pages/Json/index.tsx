import { useEffect, useState } from 'react';
import { Tabs, Radio } from 'antd';

import JsonParseComponent from './parse';
import JsonConvertComponent from './convert';

import CustomTabs from '@/components/CustomTabs';

const JsonComponent = () => {
  return (
    <CustomTabs
      items={[
        {
          label: `解析`,
          key: '1',
          children: <JsonParseComponent />,
        },
        {
          label: `转换`,
          key: '2',
          children: <JsonConvertComponent />,
        },
      ]}
    />
  );
};

export default JsonComponent;
