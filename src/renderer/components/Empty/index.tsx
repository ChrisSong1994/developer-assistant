import { Empty as BaseEmpty } from 'antd';
import { memo } from 'react';
import empty from '../../../assets/empty.svg';

export interface IEmptyProps {
  description: string;
}

const Empty = (props: IEmptyProps) => {
  const { description } = props;

  return (
    <BaseEmpty
      image={empty}
      imageStyle={{ height: 72 }}
      description={<span style={{ color: '#dadce0' }}>{description}</span>}
    />
  );
};

export default memo(Empty);
