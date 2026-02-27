import { useEffect, useState } from 'react';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { Input, Tooltip, Spin } from 'antd';
import { cx } from '@emotion/css';
import { Image } from 'antd';

import Icon from '@/renderer/components/Icon';
import { getFilePathExt } from '@/renderer/utils';
import Events from '@/renderer/utils/events';
import './index.css';

const { TextArea } = Input;
const OCR = () => {
  // 导入文件
  const [imagePath, setImagePath] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
  const handleFileImport = async () => {
    const { fileValue, filePath } = await Events.getFileFromLocalPath({
      filters: [{ name: '图片文件', extensions: ['*.png', '*.jpeg', '*.jpg', '*.webp'] }],
      encoding: 'base64',
    });

    if (fileValue) {
      const fileExt = getFilePathExt(filePath);
      const base64Url = `data:image/${fileExt};base64,${fileValue}`;
      setImagePath(base64Url);
      setLoading(true);
      const result = await Events.getImgOcrText(filePath);
      setLoading(false);
      setOcrText(result.text);
    }
  };

  useEffect(() => {
    if (!imagePath) {
      setOcrText('');
    }
  }, [imagePath]);

  return (
    <div className="ocr-container">
      <div className="ocr-image">
        {imagePath ? (
          <>
            <Image src={imagePath} preview={false} />
            <Tooltip placement="bottom" title="清除">
              <Icon className="ocr-image-delete" type="icon-delete" size={18} onClick={() => setImagePath('')} />
            </Tooltip>
          </>
        ) : (
          <div className={cx('ocr-image-empty', 'ocr-image-empty-tip')} onClick={handleFileImport}>
            <MedicineBoxOutlined className="add-file" />
            <span>请点击选取图片</span>
          </div>
        )}
      </div>
      <div className="ocr-result">
        <div className="ocr-result-title">识别结果</div>
        <Spin size="large" spinning={loading}>
          <TextArea value={ocrText} style={{ height: '100%' }} onChange={(e) => setOcrText(e.target.value)} />
        </Spin>
      </div>
    </div>
  );
};

export default OCR;
