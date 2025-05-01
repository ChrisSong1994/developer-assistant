import Generate from './Generate';
import Decode from './Decode';

import CustomTabs from '@/renderer/components/CustomTabs';

export const EDITOR_HEIGHT_PADDING = 130;

const JsonComponent = () => {
  return (
    <CustomTabs
      items={[
        {
          label: `生成`,
          key: '1',
          children: <Generate />,
        },

        {
          label: `解码`,
          key: '2',
          children: <Decode />,
        },
      ]}
    />
  );
};

export default JsonComponent;
