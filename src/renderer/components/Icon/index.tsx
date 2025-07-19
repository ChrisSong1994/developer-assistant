import { css } from '@emotion/css';
import { memo } from 'react';

import './index.less';

interface IProps {
  type: string;
  className?: string;
  onClick?: () => void;
  size?: number;
  withHoverBg?: boolean;
  styles?: Record<string, any>;
  [k: string]: any;
}

const Icon = ({ type, withHoverBg = false, className = '', size = 18, styles = {}, ...resetProps }: IProps) => {
  return (
    <i
      className={`iconfont
      ${withHoverBg ? 'hover-bg' : ''} 
      ${type} 
      ${css(`
      padding: 0 3px;
      cursor:pointer;
      line-height: normal;
    `)} 
    ${className}`}
      style={{ ...styles, fontSize: size }}
      {...resetProps}
    />
  );
};

export default memo(Icon);
