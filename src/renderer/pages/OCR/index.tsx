import { useEffect, useState } from 'react';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { cx } from '@emotion/css';
import { Image } from 'antd';

import { getFilePathExt } from '@/renderer/utils';
import Events from '@/renderer/utils/events';
import styles from './index.module.less';
const OCR = () => {
  // 导入文件
  const [imagePath, setImagePath] = useState('');
  const [ocrText, setOcrText] = useState('');
  const handleFileImport = async () => {
    const { fileValue, filePath } = await Events.getFileFromLocalPath({
      filters: [{ name: '图片文件', extensions: ['*.png', '*.jpeg', '*.jpg', '*.webp'] }],
      encoding: 'base64',
    });
    if (fileValue) {
      const fileExt = getFilePathExt(filePath);
      const base64Url = `data:image/${fileExt};base64,${fileValue}`;
      // onChange(base64Url);
      setImagePath(base64Url);
      const result = await Events.getImgOcrText(filePath);
      debugger;
      setOcrText(result.text);
    }
  };

  // useEffect(() => {
  //   if (imagePath) {
  //     onChange(imagePath);
  //   }
  // }, [imagePath]);

  return (
    <div className="ocr-container">
      <div className="ocr-image">
        {imagePath ? (
          <Image src={imagePath} />
        ) : (
          <div className={cx(styles['editor-empty'], styles['editor-empty-tip'])} onClick={handleFileImport}>
            <MedicineBoxOutlined className={styles['add-file']} />
            <span>请输入文本信息或点击图标导入文本文件</span>
          </div>
        )}
      </div>
      <div className="ocr-result">
        <div className="ocr-result-title">识别结果</div>
        <div className="ocr-result-content" style={{ whiteSpace: 'pre-wrap' }}>
          {ocrText}
        </div>
      </div>
    </div>
  );
};

export default OCR;
