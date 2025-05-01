import { HolderOutlined } from '@ant-design/icons';

import Icon from '@/renderer/components/Icon';
import styles from './index.module.less';

export interface AppItemProps {
  data: { title: string; icon: string; key: string };
  canDetele?: boolean;
  onClick: (key: string) => void;
  onDelete: (key: string) => void;
}
export default function AppItem(props: AppItemProps) {
  const { data, onDelete, canDetele, onClick } = props;

  const handleActive = () => {
    if (canDetele) return;
    onClick(data.key);
  };

  return (
    <div className={styles['applications-quick-apps-item']} key={data.key} onClick={handleActive}>
      <Icon className={styles['applications-quick-apps-item-icon']} size={24} type={data.icon} />
      <span className={styles['applications-quick-apps-item-label']}>{data.title}</span>
      <div className={styles['applications-quick-apps-item-handle-btn']}>
        <HolderOutlined />
      </div>
    </div>
  );
}
