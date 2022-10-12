import React, { memo } from 'react';
import { Row, Col } from 'antd';

interface Props {
  children: React.ReactNode;
}

const PageLyout = ({ children }: Props) => {
  return (
    <Row>
      <Col span={22} offset={1}>
        {children}
      </Col>
    </Row>
  );
};

export default memo(PageLyout);
