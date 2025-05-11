import { useEffect, useState } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';

import Item from './Item';
import { useMenus } from '@/renderer/hooks';
import Icon from '@/renderer/components/Icon';
import styles from './index.module.less';

export interface AppItemProps {
  data?: { title: string; icon: string; key: string };
  id: string;
  index?: number;
  onClick?: (key: string) => void;
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500); // 为什么 500 ms
    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}

export default function AppItem(props: AppItemProps) {
  const { id, onClick, index } = props;
  const menusMap = useMenus();
  const data = menusMap.get(id);

  const { setNodeRef, listeners, isDragging, isSorting, transform, transition } = useSortable({
    id,
  });

  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;
  const handleActive = () => {
    onClick && onClick(data.key);
  };

  return (
    <Item
      ref={setNodeRef}
      dragging={isDragging}
      sorting={isSorting}
      index={index}
      handle={true}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
    >
      <div className={styles['applications-quick-apps-item']} key={data.key} onClick={handleActive}>
        <Icon className={styles['applications-quick-apps-item-icon']} size={24} type={data.icon} />
        <span className={styles['applications-quick-apps-item-label']}>{data.title}</span>
        <div className={styles['applications-quick-apps-item-handle-btn']} {...listeners}>
          <HolderOutlined />
        </div>
      </div>
    </Item>
  );
}
