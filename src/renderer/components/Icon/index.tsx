import { css } from '@emotion/css';
import { memo } from 'react';

import "./index.less";

interface IProps {
  type: string;
  className?: string;
  onClick?: () => void;
  size?: number;
  withHoverBg?: boolean;
  [k: string]: any;
}

const Icon = ({ type, withHoverBg = false, className = '', size = 18, ...resetProps }: IProps) => {
  return (
    <i
      className={`iconfont
      ${withHoverBg ? 'hover-bg' : ''} 
      ${type} 
      ${css(`
      padding: 0 3px;
      font-size:${size}px;
      cursor:pointer;
    `)} 
    ${className}`}
      {...resetProps}
    />
  );
};

export default memo(Icon);
