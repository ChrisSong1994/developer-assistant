import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Segmented } from 'antd';
import { useState } from 'react';

import ColorPicker from '@/components/ColorPicker';
import ImageUpload from '@/components/ImageUpload';
import QRCode, { IQRCodeProps } from '@/components/QRCode';
import Events from '@/utils/events';
import styles from './index.less';

const TextArea = Input.TextArea;
const FormItem = Form.Item;

const SIZE_LIMIT = { low: 80, high: 360 };
const ERROR_LEVEL = ['L', 'M', 'Q', 'H'];

const Generate = () => {
  const [value, setValue] = useState<string>('');
  const [size, setSize] = useState<number>(200);
  const [errorLevel, setErrorLevel] = useState<IQRCodeProps['errorLevel']>('M');
  const [color, setColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [icon, setIcon] = useState<string>('');
  const [iconSize, setIconSize] = useState<number>(40);

  const handleSizeChange = (value: number) => {
    if (value >= SIZE_LIMIT.high || value <= SIZE_LIMIT.low) return;

    setSize(value);
  };

  const handleValueChange = (e: any) => {
    setValue(e.target.value);
  };

  const downloadQRCode = async () => {
    const canvas = document.getElementById('qrcode')?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      await Events.saveBase64ImageToLocal({
        fileName: 'Untitled.png',
        payload: url.replace('data:image/png;base64,', ''),
        format: 'png',
      });
    }
  };

  return (
    <div id="qrcode" className={styles['qrcode-generate']}>
      <div className={styles['content']}>
        <div className={styles['content-code']}>
          <QRCode
            style={{ boxShadow: '0 6px 16px 0 rgba(0,0,0,.2)' }}
            value={value}
            size={size}
            color={color}
            bgColor={bgColor}
            errorLevel={errorLevel}
            icon={icon}
            iconSize={iconSize}
          />
        </div>

        <TextArea rows={10} placeholder="请输入地址或文本内容" onChange={handleValueChange} />
      </div>
      <div className={styles['config']}>
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <FormItem label="尺寸">
            <Button.Group style={{ marginBottom: 16 }}>
              <Button
                onClick={() => handleSizeChange(size - 10)}
                disabled={size <= SIZE_LIMIT.low}
                icon={<MinusOutlined />}
              >
                减小
              </Button>
              <Button
                onClick={() => handleSizeChange(size + 10)}
                disabled={size >= SIZE_LIMIT.high}
                icon={<PlusOutlined />}
              >
                增加
              </Button>
            </Button.Group>
          </FormItem>
          <FormItem label="容错率" tooltip="容错率设置越高，二维码生成的码点密度越高，可在遮挡越多的情况下被扫描出来。">
            <Segmented
              options={ERROR_LEVEL}
              value={errorLevel}
              onChange={(v) => setErrorLevel(v as IQRCodeProps['errorLevel'])}
            />
          </FormItem>
          <FormItem label="码颜色">
            <ColorPicker value={color} onChange={setColor} />
          </FormItem>
          <FormItem label="背景颜色">
            <ColorPicker value={bgColor} onChange={setBgColor} />
          </FormItem>
          <FormItem label="icon">
            <ImageUpload
              style={{ height: 64, with: 200 }}
              imageStyle={{ height: 48 }}
              value={icon}
              onChange={setIcon}
            />
          </FormItem>
          {icon ? (
            <FormItem label="icon尺寸">
              <InputNumber addonAfter="px" value={iconSize} onChange={(v) => setIconSize(v as number)} />
            </FormItem>
          ) : null}
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button type="primary" onClick={downloadQRCode}>
              保存图片
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Generate;