import { InfoCircleOutlined } from '@ant-design/icons';
import { Checkbox, Dropdown, MenuProps, Modal } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';

import { GITHUB_RELEASE_URL, GITHUB_ISSUE_URL } from '@/common/contants';
import Icon from '@/renderer/components/Icon';
import { useConfigData } from '@/renderer/hooks';
import Events from '@/renderer/utils/events';
import About from './About';
import Setting from './Setting';
interface IConfigMenuProps {
  children: React.ReactNode;
}

const menuStyle = {
  width: 200,
};

const ConfigMenu = (props: IConfigMenuProps) => {
  const { children } = props;
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const { data, setData } = useConfigData();

  const handleCheckUpdate = async () => {
    const result = await Events.checkUpdate();
    if (result.isNeedUpdate) {
      let closeCheckUpdate = false;
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
          Events.openUrl({ url: GITHUB_RELEASE_URL });
        },
      });
    }
  };

  useEffect(() => {
    if (data?.checkUpdate) {
      handleCheckUpdate();
    }
  }, [data?.checkUpdate]);

  const menuItems: MenuProps['items'] = [
    {
      label: <div onClick={() => setAboutOpen(true)}>关于</div>,
      key: 'about',
      icon: <Icon type="icon-info" />,
    },
    {
      label: <div onClick={handleCheckUpdate}>检查更新</div>,
      key: 'check-update',
      icon: <Icon type="icon-update" />,
    },
    {
      label: <div onClick={() => Events.openUrl({ url: GITHUB_ISSUE_URL })}>意见反馈</div>,
      key: 'feedback',
      icon: <Icon type="icon-feedback" />,
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={() => setSettingOpen(true)}>设置</div>,
      key: 'setting',
      icon: <Icon type="icon-setting" />,
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={() => Events.quit()}>退出</div>,
      key: 'quit',
      icon: <Icon type="icon-exit" />,
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
