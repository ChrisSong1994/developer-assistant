import { Dropdown, MenuProps } from 'antd';
import React, { Fragment, useState } from 'react';

import Icon from '@/components/Icon';
import Events from '@/utils/events';
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

  const handleCheckUpdate = () => {};

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
