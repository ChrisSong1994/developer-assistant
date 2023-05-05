import { css } from '@emotion/css';
import { memo } from 'react';

interface IProps {
  type: string;
  className?: string;
  onClick?: () => void;
  size?: number;
  [k: string]: any;
}

const Icon = ({ type, className, size = 18, ...resetProps }: IProps) => {
  return (
    <i
      className={`iconfont ${type} ${css(`
      padding: 0 3px;
      font-size:${size}px;
      cursor:pointer;
    `)} ${className}`}
      {...resetProps}
    />
  );
};

export default memo(Icon);
