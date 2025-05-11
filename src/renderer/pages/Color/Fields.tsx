import { Col, Row, Tooltip } from 'antd';
import * as color from 'react-color/es/helpers/color';

import EditableInput from '@/renderer/components/EditableInput';
import Icon from '@/renderer/components/Icon';
import styles from './index.module.less';

interface IProps {
  onChange: (val: Record<string, any>, e: any) => void;
  rgb: Record<string, any>;
  hsl: Record<string, any>;
  hex: Record<string, any>;
  hsv: Record<string, any>;
}

const Fields = (porps: IProps) => {
  const { onChange, rgb, hsl, hsv, hex } = porps;

  const rgbValue = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  const hslValue = `${Math.round(hsl.h)}°, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%`;
  const hsvValue = `${Math.round(hsv.h)}°, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%`;

  const handleChange = (data: any, e: any) => {
    if (data.hex && color.isValidHex(data.hex)) {
      onChange(
        {
          hex: data.hex,
          source: 'hex',
        },
        e,
      );
    } else if (data.rgb && color.isvalidColorString(data.rgb, 'rgb')) {
      const values = data.rgb.split(',');
      onChange(
        {
          r: values[0],
          g: values[1],
          b: values[2],
          a: 1,
          source: 'rgb',
        },
        e,
      );
    } else if (data.hsv && color.isvalidColorString(data.hsv, 'hsv')) {
      const values = data.hsv.split(',');
      values[2] = values[2].replace('%', '');
      values[1] = values[1].replace('%', '');
      values[0] = values[0].replace('°', '');

      onChange(
        {
          h: Number(values[0]),
          s: Number(values[1]),
          v: Number(values[2]),
          source: 'hsv',
        },
        e,
      );
    } else if (data.hsl && color.isvalidColorString(data.hsl, 'hsl')) {
      const values = data.hsl.split(',');
      values[2] = values[2].replace('%', '');
      values[1] = values[1].replace('%', '');
      values[0] = values[0].replace('°', '');
      onChange(
        {
          h: Number(values[0]),
          s: Number(values[1]),
          v: Number(values[2]),
          source: 'hsl',
        },
        e,
      );
    }
  };

  // 颜色吸取
  const handleSystemColorPicker = () => {
    // @ts-ignore
    const eyeDropper = new EyeDropper();
    eyeDropper
      .open()
      .then((result: any) => {
        handleChange({ hex: result.sRGBHex }, null);
      })
      .catch((error: any) => {
        console.warn('handleSystemColorPicker error', error);
      });
  };

  return (
    <section className={styles['color-picker-fields']}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div className={styles['color-picker-fields-hex']}>
            <EditableInput style={{ flex: 1 }} labelPosition="center" label="HEX" value={hex} onChange={handleChange} />
            <Tooltip placement="bottom" title="吸取颜色">
              <Icon style={{ margin: '0 8px' }} type="icon-xiqu" size={22} onClick={handleSystemColorPicker} />
            </Tooltip>
          </div>
        </Col>
        <Col span={8}>
          <EditableInput labelPosition="left" label="RGB" value={rgbValue} onChange={handleChange} />
        </Col>
        <Col span={8}>
          <EditableInput labelPosition="left" label="HSV" value={hsvValue} onChange={handleChange} />
        </Col>
        <Col span={8}>
          <EditableInput labelPosition="left" label="HSL" value={hslValue} onChange={handleChange} />
        </Col>
      </Row>
    </section>
  );
};

export default Fields;
