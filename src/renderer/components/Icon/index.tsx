import { memo } from 'react';

interface IProps {
  type: string;
  className?: string;
  onClick?: () => void;
  size?: number;
}

const Icon = ({ type, className, size = 18, ...resetProps }: IProps) => {
  return <i className={`iconfont ${type} ${className}`} style={{ padding: '0 3px', fontSize: size }} {...resetProps} />;
};

export default memo(Icon);
