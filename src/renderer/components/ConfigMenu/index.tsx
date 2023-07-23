import { InfoCircleOutlined } from '@ant-design/icons';
import { Checkbox, Dropdown, MenuProps, Modal } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import semver from 'semver';

import Icon from '@/components/Icon';
import { useConfigData } from '@/hooks';
import { isEmpty } from '@/utils';
import Events from '@/utils/events';
import About from './About';
import Setting from './Setting';
interface IConfigMenuProps {
  children: React.ReactNode;
}

const menuStyle = {
  width: 200,
};
const remotePackageUrl = 'https://raw.githubusercontent.com/ChrisSong1994/developer-assistant/main/package.json';

const ConfigMenu = (props: IConfigMenuProps) => {
  const { children } = props;
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const { data, setData } = useConfigData();

  const handleCheckUpdate = async () => {
    const localVersion = await Events.getAppVersion();
    const remotePackage = await fetch(remotePackageUrl, { method: 'get', cache: 'no-cache' }).then((res) => res.json());
    let closeCheckUpdate = false;
    if (semver.gt(remotePackage.version, localVersion)) {
      Modal.confirm({
        title: '有新版本发布，是否更新？',
        cancelText: '关闭',
        okText: '去下载',
        icon: <InfoCircleOutlined />,
        content: data?.checkUpdate ? (
          <div style={{ paddingTop: 20 }}>
            <Checkbox onChange={() => (closeCheckUpdate = !closeCheckUpdate)}>关闭版本更新提示</Checkbox>
          </div>
        ) : null,
        onCancel() {
          if (closeCheckUpdate) {
            setData({ checkUpdate: !closeCheckUpdate });
          }
        },
        onOk() {
          Events.openUrl({ url: 'https://github.com/ChrisSong1994/developer-assistant/releases' });
        },
      });
    }
  };

  useEffect(() => {
    if (!isEmpty(data) && data?.checkUpdate) {
      handleCheckUpdate();
    }
  }, [data]);

  const menuItems: MenuProps['items'] = [
    {
      label: <div onClick={() => setAboutOpen(true)}>关于</div>,
      key: 'about',
      icon: <Icon type="icon-guanyu" />,
    },
    {
      label: <div onClick={handleCheckUpdate}>检查更新</div>,
      key: 'check-update',
      icon: <Icon type="icon-update" />,
    },
    {
      label: (
        <div onClick={() => Events.openUrl({ url: 'https://github.com/ChrisSong1994/developer-assistant/issues' })}>
          意见反馈
        </div>
      ),
      key: 'feedback',
      icon: <Icon type="icon-fankui" />,
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={() => setSettingOpen(true)}>设置</div>,
      key: 'setting',
      icon: <Icon type="icon-shezhi1" />,
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={() => Events.quit()}>退出</div>,
      key: 'quit',
      icon: <Icon type="icon-tuichu" />,
    },
  ];

  return (
    <Fragment>
      <Dropdown trigger={['click']} placement="bottom" menu={{ items: menuItems, style: menuStyle }}>
        {children}
      </Dropdown>
      <Setting open={settingOpen} onClose={() => setSettingOpen(false)} />
      <About open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </Fragment>
  );
};

export default ConfigMenu;
