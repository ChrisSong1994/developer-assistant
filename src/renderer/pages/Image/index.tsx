import CustomTabs from '@/components/CustomTabs';
import Compress from './Compress';
import Editor from './Editor';

const Image = () => {
  return (
    <CustomTabs
      items={[
        {
          label: `图片编辑`,
          key: '1',
          children: <Editor />,
        },

        {
          label: `图片压缩`,
          key: '2',
          children: <Compress />,
        },
      ]}
    />
  );
};

export default Image;
