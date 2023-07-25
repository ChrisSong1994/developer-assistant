import { Button, Drawer, Switch } from 'antd';
import { useEffect, useState } from 'react';

import { useConfigData, useLocalData } from '@/hooks';
import Events from '@/utils/events';

import styles from './index.less';

interface ISettingProps {
  open: boolean;
  onClose: () => void;
}

const Setting = (props: ISettingProps) => {
  const { open, onClose } = props;
  const { data, setData } = useConfigData();
  const { clearData } = useLocalData();
  const [openAtLogin, setOpenAtLogin] = useState<boolean>();

  const handleSelectDownloadPath = async () => {
    const result = await Events.getSingleDirPath({ defaultPath: data?.downloadPath });
    if (result) {
      await setData({ downloadPath: result });
    }
  };

  const handleSetOpenAtLogin = async (bool: boolean) => {
    await Events.setOpenAtLogin(bool);
    setOpenAtLogin(bool);
  };

  const handleSetCheckUpdate = async (bool: boolean) => {
    await setData({ checkUpdate: bool });
  };

  const handleClearCacheData = async () => {
    await clearData();
  };

  useEffect(() => {
    (async () => {
      const bool = await Events.getOpenAtLogin();
      setOpenAtLogin(bool);
    })();
  }, []);

  return (
    <Drawer
      title="设置"
      placement="right"
      headerStyle={{ height: 48 }}
      width={480}
      closable={false}
      onClose={onClose}
      open={open}
    >
      <div className={styles['setting']}>
        <div className={styles['setting-item']}>
          <span> 默认下载路径：</span> {data?.downloadPath}
          <Button type="link" onClick={handleSelectDownloadPath}>
            更改
          </Button>
        </div>
        <div className={styles['setting-item']}>
          <span> 开机启动：</span>
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={openAtLogin}
            onChange={handleSetOpenAtLogin}
          />
        </div>
        <div className={styles['setting-item']}>
          <span> 开启检查更新： </span>
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={data?.checkUpdate}
            onChange={handleSetCheckUpdate}
          />
        </div>
        <div className={styles['setting-item']}>
          <span> 清除本地缓存：</span>
          <Button type="primary" size="small" onClick={handleClearCacheData}>
            清除
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default Setting;
