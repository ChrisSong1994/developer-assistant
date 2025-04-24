import { useMemo } from 'react';
import { Divider } from 'antd';

import { useLocalData } from '@/hooks';
import routes from '@/layouts/routes';
import AppItem from './AppItem';
import styles from './index.module.less';

const Applications = () => {
  const { data: localData, setData: setLocalData } = useLocalData();

  const siderMenuItems = useMemo(() => {
    return routes.filter((item) => localData.sider_menus.includes(item.key));
  }, [localData.sider_menus]);

  const otherMenuItems = useMemo(() => {
    return routes.filter((item) => !localData.sider_menus.includes(item.key));
  }, [localData.sider_menus]);

  const handleActive = (key: string) => {
    setLocalData({
      ...localData,
      active_menu_key: key,
      more_active_menu_key: key,
    });
  };

  const handleRemove = (key: string) => {
    console.log('删除', key);
  };

  return (
    <div className={styles['applications']}>
      <div className={styles['applications-quick-apps']}>
        <span className={styles['applications-quick-apps-tip']}>快捷键：</span>
        <div className={styles['applications-quick-apps-wrap']}>
          {siderMenuItems.map((item) => {
            return <AppItem key={item.key} data={item} canDetele={true} onClick={() => {}} onDelete={handleRemove} />;
          })}
        </div>
      </div>
      <Divider>全部应用</Divider>
      <div className={styles['applications-quick-apps-wrap']}>
        {otherMenuItems.map((item) => {
          return <AppItem key={item.key} data={item} onClick={handleActive} onDelete={handleRemove} />;
        })}
      </div>
    </div>
  );
};

export default Applications;
