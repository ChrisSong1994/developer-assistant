import CustomTabs from '@/renderer/components/CustomTabs';
// import Asymmetric from './Asymmetric';
import Hash from './Hash';
import Symmetric from './Symmetric';

const Encryption = () => {
  return (
    <CustomTabs
      tabStyle={{ marginBottom: 14 }}
      items={[
        {
          label: `hash加密`,
          key: '1',
          children: <Hash />,
        },
        {
          label: `对称加密`,
          key: '2',
          children: <Symmetric />,
        },
        // {
        //   label: `非对称加密`,
        //   key: '3',
        //   children: <Asymmetric />,
        // },
      ]}
    />
  );
};

export default Encryption;
