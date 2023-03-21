import CustomTabs from '@/components/CustomTabs';
import Base64CodingComponent from './Base64';
import UrlCodingComponent from './Url';

const JsonComponent = () => {
  return (
    <CustomTabs
      tabStyle={{ marginBottom: 14 }}
      items={[
        {
          label: `URL编解码`,
          key: '1',
          children: <UrlCodingComponent />,
        },
        {
          label: `BASE64编解码`,
          key: '2',
          children: <Base64CodingComponent />,
        },
      ]}
    />
  );
};

export default JsonComponent;
