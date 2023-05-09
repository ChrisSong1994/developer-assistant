import { UploadOutlined } from '@ant-design/icons';
import { Button, Image } from 'antd';
import { memo } from 'react';

import Events from '@/utils/events';
import fallbackImg from './fallbackImg';

interface IImageUploadProps {
  value: string;
  onChange: (v: string) => void;
  style?: Record<string, any>;
}

const ImageUpload = (props: IImageUploadProps) => {
  const { value, onChange, style = {} } = props;

  const handleUploadImage = async () => {
    const fileValue = await Events.getFileFromLocalPath({
      filters: [{ name: '图片文件', extensions: ['*.png', '*.jpeg'] }],
      encoding: 'base64',
    });
    if (fileValue) onChange(fileValue);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 318,
        border: '1px dashed #d9d9d9',
        backgroundColor: '##fafafa',
        ...style,
      }}
    >
      {value ? (
        <Image height={300} src={`data:image/png;base64,${value}`} fallback={fallbackImg} />
      ) : (
        <Button icon={<UploadOutlined />} onClick={handleUploadImage}>
          添加图片
        </Button>
      )}
    </div>
  );
};

export default memo(ImageUpload);
