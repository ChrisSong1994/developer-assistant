import JsonConvertComponent from './Convert';
import JsonParseComponent from './Parse';

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
