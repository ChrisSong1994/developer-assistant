import { UploadOutlined } from '@ant-design/icons';
import { Button, Image, Tooltip } from 'antd';
import { CSSProperties, memo } from 'react';

import { getFilePathExt } from '@/utils';
import Events from '@/utils/events';
import Icon from '../Icon';
import fallbackImg from './fallbackImg';

interface IImageUploadProps {
  value: string;
  onChange: (v: string) => void;
  style?: Record<string, any>;
  imageStyle?: CSSProperties;
}

const ImageUpload = (props: IImageUploadProps) => {
  const { value, onChange, style = {}, imageStyle = {} } = props;

  const handleUploadImage = async () => {
    const { fileValue, filePath } = await Events.getFileFromLocalPath({
      filters: [{ name: '图片文件', extensions: ['*.png', '*.jpeg','*.jpg','*.webp'] }],
      encoding: 'base64',
    });
    if (fileValue) {
      const fileExt = getFilePathExt(filePath);
      const base64Url = `data:image/${fileExt};base64,${fileValue}`;
      onChange(base64Url);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
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
        <Tooltip placement="bottom" title="清除">
          <Icon type="icon-delete" style={{ position: 'absolute', top: 6, right: 6 }} onClick={handleClear} />
        </Tooltip>
      ) : null}

      {value ? (
        <Image style={imageStyle} src={value} fallback={fallbackImg} />
      ) : (
        <Button icon={<UploadOutlined />} onClick={handleUploadImage}>
          添加图片
        </Button>
      )}
    </div>
  );
};

export default memo(ImageUpload);
