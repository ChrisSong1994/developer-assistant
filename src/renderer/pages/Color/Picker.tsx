import { Fragment, useMemo } from 'react';
import ColorWrap from 'react-color/es/components/common/ColorWrap';
import Hue from 'react-color/es/components/common/Hue';
import Saturation from 'react-color/es/components/common/Saturation';
import GooglePointer from 'react-color/es/components/google/GooglePointer';
import GooglePointerCircle from 'react-color/es/components/google/GooglePointerCircle';

import Fields from './Fields';

import styles from './index.module.less';
import { toCmyk, cmykToRgb, formatCmyk } from './convert';

const Color = ({ onChange, rgb, hsl, hsv, hex }: any) => {
  const calcCmyk = useMemo(() => toCmyk(rgb), [rgb]);

  const handleChange = (data: any, e: any) => {
    if (data?.source === 'cmyk') {
      const cmykVal = formatCmyk(data);
      const rgbVal = cmykToRgb(cmykVal);
      onChange({ ...rgbVal, source: 'rgb' }, e);
      return;
    }
    onChange(data, e);
  };
  return (
    <Fragment>
      <div className={styles['color-picker-select']}>
        <div
          className={styles['color-picker-swatch']}
          style={{
            background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
          }}
        />
        <div className={styles['color-picker-saturation']}>
          <Saturation hsl={hsl} hsv={hsv} pointer={GooglePointerCircle} onChange={handleChange} />
        </div>
      </div>

      <div className={styles['color-picker-hue']}>
        <Hue hsl={hsl} hsv={hsv} radius="4px" pointer={GooglePointer} onChange={handleChange} />
      </div>

      <div>
        <Fields rgb={rgb} cmyk={calcCmyk} hsl={hsl} hex={hex} hsv={hsv} onChange={handleChange} />
      </div>
    </Fragment>
  );
};

export default ColorWrap(Color);
