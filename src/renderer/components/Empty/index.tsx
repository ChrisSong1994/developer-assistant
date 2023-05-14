import { Empty as BaseEmpty } from 'antd';
import React, { CSSProperties, memo } from 'react';
import empty from '../../../assets/empty.svg';

export interface IEmptyProps {
  description: React.ReactNode;
  style?: CSSProperties;
}

const Empty = (props: IEmptyProps) => {
  const { description, style = {} } = props;

  return (
    <div style={{ ...style }}>
      <BaseEmpty
        image={empty}
        imageStyle={{ height: 72 }}
        description={<span style={{ color: '#dadce0' }}>{description}</span>}
      />
    </div>
  );
};

export default memo(Empty);
