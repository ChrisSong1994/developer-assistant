import { memo } from 'react';

interface IProps {
  type: string;
  className?: string;
  onClick?: () => void;
}

const Icon = ({ type, className, ...resetProps }: IProps) => {
  return (
    <i className={`iconfont ${type} ${className}`} style={{ padding: '0 3px' }} {...resetProps} />
  );
};

export default memo(Icon);
