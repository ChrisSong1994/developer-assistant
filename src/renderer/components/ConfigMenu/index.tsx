import { Dropdown, MenuProps } from 'antd';
import React from 'react';

import Icon from '@/components/Icon';

interface IConfigMenuProps {
  children: React.ReactNode;
}

const ConfigMenu = (props: IConfigMenuProps) => {
  const { children } = props;
  const menuStyle = {
    width: 200,
  };
  const menuItems: MenuProps['items'] = [
    {
      label: <div>关于</div>,
      key: 'about',
      icon: <Icon type="icon-guanyu" />,
    },
    {
      label: <div>检查更新</div>,
      key: 'check-update',
      icon: <Icon type="icon-update" />,
    },
    {
      label: <div>意见反馈</div>,
      key: 'feedback',
      icon: <Icon type="icon-feedback" />,
    },
    {
      type: 'divider',
    },
    {
      label: <div>设置</div>,
      key: 'setting',
      icon: <Icon type="icon-shezhi1" />,
    },
    {
      type: 'divider',
    },
    {
      label: <div>退出</div>,
      key: 'quit',
      icon: <Icon type="icon-tuichu" />,
    },
  ];

  return (
    <Dropdown trigger={['click']} placement="bottom" menu={{ items: menuItems, style: menuStyle }}>
      {children}
    </Dropdown>
  );
};

export default ConfigMenu;
