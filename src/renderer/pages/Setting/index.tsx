import { useConfigData } from '@/hooks';
import { Button, Switch } from 'antd';

import styles from './index.less';

const Setting = (props: any) => {
  const { loading, data, setData } = useConfigData();
  return (
    <div className={styles['setting']}>
      <div className={styles['setting-item']}>
        <span> 默认下载路径：</span> {data.downloadPath} <Button type="link">更改</Button>
      </div>

      <div className={styles['setting-item']}>
        <span> 是否开机启动：</span>
        <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={data.openAtLogin || false} />
      </div>
      <div className={styles['setting-item']}>
        <span> 当前版本：</span>0.0.1 <Button type="primary">检查更新</Button>
      </div>
      <div className={styles['setting-item']}>
        <span> 清除本地缓存：</span> <Button type="primary">清除</Button>
      </div>
    </div>
  );
};

export default Setting;
