import { memo } from 'react';

interface IProps {
  type: string;
  className?: string;
}

const Icon = ({ type, className }: IProps) => {
  return <i className={`iconfont ${type} ${className}`} style={{ padding: '0 3px' }} />;
};

export default memo(Icon);
