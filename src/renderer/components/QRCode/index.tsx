import { QRCodeCanvas } from 'qrcode.react';
import React, { CSSProperties, memo, useMemo } from 'react';

export interface ImageSettings {
  src: string;
  height: number;
  width: number;
  excavate: boolean;
  x?: number;
  y?: number;
}

export interface QRPropsCanvas {
  value: string;
  size?: number;
  color?: string;
  bgColor?: string;
  style?: CSSProperties;
  includeMargin?: boolean;
  imageSettings?: ImageSettings;
}

export interface IQRCodeProps extends QRPropsCanvas {
  icon?: string;
  iconSize?: number;
  bordered?: boolean;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
}

const QRCode: React.FC<IQRCodeProps> = (props) => {
  const {
    value,
    icon = '',
    size = 200,
    iconSize = 40,
    color = '#000',
    bgColor = '#fff',
    errorLevel = 'M',
    style,
  } = props;

  const qrCodeProps = useMemo<QRPropsCanvas>(() => {
    const imageSettings: IQRCodeProps['imageSettings'] = {
      src: icon,
      x: undefined,
      y: undefined,
      height: iconSize,
      width: iconSize,
      excavate: true,
    };
    return {
      value,
      size: size,
      level: errorLevel,
      bgColor: bgColor,
      fgColor: color,
      imageSettings: icon ? imageSettings : undefined,
    };
  }, [errorLevel, color, icon, iconSize, size, value, bgColor]);

  return (
    <div style={{ ...style, width: size, height: size }}>
      <QRCodeCanvas {...qrCodeProps} />
    </div>
  );
};

export default memo(QRCode);
