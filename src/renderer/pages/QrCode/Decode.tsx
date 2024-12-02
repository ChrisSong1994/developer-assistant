import { Input, Tooltip } from 'antd';
import QrCodeReader from 'qrcode-reader';
import { useEffect, useState } from 'react';

import ActionsBarWrap from '@/components/ActionsBarWrap';
import Copy from '@/components/Copy';
import Icon from '@/components/Icon';
import ImageUpload from '@/components/ImageUpload';
import Events from '@/utils/events';
import styles from './index.module.less';

const TextArea = Input.TextArea;

const Decode = () => {
  const [decodeValue, setDecodeValue] = useState<string>('');
  const [base64Url, setBase64Url] = useState<string>('');

  const handleSave = (value: string) => {
    Events.saveFileToLocal({ fileName: 'QRCode.text', payload: value });
  };

  useEffect(() => {
    if (base64Url) {
      const qr = new QrCodeReader();
      qr.callback = (err: any, res: any) => {
        if (!err) setDecodeValue(res.result);
      };
      qr.decode(base64Url);
    } else {
      setDecodeValue('');
    }
  }, [base64Url]);

  return (
    <div className={styles['qrcode-decode']}>
      <ImageUpload imageStyle={{ height: 300 }} style={{ marginBottom: 8 }} onChange={setBase64Url} value={base64Url} />
      <ActionsBarWrap palcement="right">
        <Copy value={decodeValue} size={18} />
        <Tooltip placement="bottom" title="保存">
          <Icon type="icon-baocun" size={18} onClick={() => handleSave(decodeValue)} />
        </Tooltip>
      </ActionsBarWrap>
      <TextArea spellCheck={false} rows={14} placeholder="请输入待解码内容" value={decodeValue} />
    </div>
  );
};

export default Decode;
