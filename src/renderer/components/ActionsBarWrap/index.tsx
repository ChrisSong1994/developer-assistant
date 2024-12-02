import React, { memo } from 'react';

import styles from './index.module.less';

interface IActionsBarProps {
  children: React.ReactNode;
  palcement?: 'left' | 'right';
}

const ActionsBarWrap = (props: IActionsBarProps) => {
  const { children, palcement = 'left' } = props;

  return (
    <div className={styles['actions-bar']} style={{ justifyContent: palcement }}>
      {children}
    </div>
  );
};

export default memo(ActionsBarWrap);
