import { useConfigData, useLocalData } from '@/hooks';
import EventBus, { EEventBusName } from '@/utils/eventBus';
import Events from '@/utils/events';
import { Button, Switch } from 'antd';
import { useEffect, useState } from 'react';

import styles from './index.less';

const Setting = (props: any) => {
  const { data, setData } = useConfigData();
  const { clearData } = useLocalData();
  const [openAtLogin, setOpenAtLogin] = useState<boolean>();

  const handleSelectDownloadPath = async () => {
    const result = await Events.getSingleDirPath({ defaultPath: data.downloadPath });
    if (result) {
      setData({ downloadPath: result });
    }
  };

  const handleSetOpenAtLogin = async (bool: boolean) => {
    await Events.setOpenAtLogin(bool);
    setOpenAtLogin(bool);
  };

  const handleClearCacheData = async () => {
    await clearData();
    EventBus.emit(EEventBusName.CLEAR_LOCAL_DATA);
  };

  useEffect(() => {
    (async () => {
      const bool = await Events.getOpenAtLogin();
      setOpenAtLogin(bool);
    })();
  }, []);

  return (
    <div className={styles['setting']}>
      <div className={styles['setting-item']}>
        <span> 默认下载路径：</span> {data.downloadPath}
        <Button type="link" onClick={handleSelectDownloadPath}>
          更改
        </Button>
      </div>
      <div className={styles['setting-item']}>
        <span> 是否开机启动：</span>
        <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={openAtLogin} onChange={handleSetOpenAtLogin} />
      </div>
      <div className={styles['setting-item']}>
        <span> 当前版本：{data.appVersion} </span>
        <Button type="primary" size="small">
          检查更新
        </Button>
      </div>
      <div className={styles['setting-item']}>
        <span> 清除本地缓存：</span>
        <Button type="primary" size="small" onClick={handleClearCacheData}>
          清除
        </Button>
      </div>
    </div>
  );
};

export default Setting;
