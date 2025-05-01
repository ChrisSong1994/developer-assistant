import { cx } from '@emotion/css';
import { Layout, Tabs, Divider } from 'antd';
import React, { FC, useLayoutEffect, useState, useMemo } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';

import { useLocalData } from '@/renderer/hooks';
import ConfigMenu from '@/renderer/components/ConfigMenu';
import Events from '@/renderer/utils/events';
import Applications from '@/renderer/pages/Applications';
import logo from '../../assets/logo.png';
import Icon from '../components/Icon';
import styles from './index.module.less';
import routes from './routes';

const { Header, Content, Sider } = Layout;

// 页面
// const pages = routes.reduce((pre: any[], cur: any) => {
//   if (cur.component) {
//     return [...pre, { ...cur }];
//   }
//   if (cur.children) {
//     return [...pre, ...cur.children];
//   }
//   return pre;
// }, []);

const BaseLayout: FC = () => {
  // const [activeKey, setActiveKey] = useState<string>(defaultSelectKey);
  const { data: localData, setData: setLocalData } = useLocalData();

  const activeKey = useMemo(() => {
    if (localData.active_menu_key) {
      return localData.active_menu_key;
    }
    return localData.sider_menus?.[0] || '';
  }, [localData.active_menu_key]);

  const tabItems = useMemo(() => {
    const tabs = routes.map((page: any) => ({
      label: '',
      key: page.key,
      children: React.createElement(page.component, { key: page.key }),
    }));
    tabs.push({
      label: '',
      key: 'more',
      // @ts-ignore
      children: <Applications />,
    });
    return tabs;
  }, [routes, localData.active_menu_key]);

  // 菜单栏
  const MenuItems = useMemo(() => {
    if (localData.sider_menus?.length) {
      return routes
        .filter((item) => localData.sider_menus.includes(item.key))
        .map((item) => {
          return {
            key: item.key,
            label: item.title,
            icon: item.icon,
          };
        });
    } else {
      return [];
    }
  }, [routes, localData.sider_menus]);

  const moreActiveTab = useMemo(() => {
    if (localData.sider_menus && localData.more_active_menu_key) {
      return routes.find((item: any) => {
        return !localData.sider_menus.includes(item.key) && item.key === localData.more_active_menu_key;
      });
    }
    return undefined;
  }, [localData.sider_menus, localData.more_active_menu_key]);

  const handleActive = (key: string) => {
    setLocalData({
      ...localData,
      active_menu_key: key,
    });
  };

  useLayoutEffect(() => {
    setTimeout(Events.windowRenderReady, 1000);
  }, []);

  return (
    <Layout className={styles['developer-container']}>
      <Header className={styles['developer-container-header']}>
        <div className={styles['developer-container-header-logo']}>
          <img src={logo} /> <div>Developer Assistant</div>
        </div>
        <div className={styles['developer-container-header-action']}>
          <ConfigMenu>
            <div className={styles['developer-container-header-action-btn']}>
              <Icon type="icon-more" />
            </div>
          </ConfigMenu>
          <div className={styles['developer-container-header-action-btn']} onClick={() => Events.windowMinimize()}>
            <Icon type="icon-minus" />
          </div>
          <div className={styles['developer-container-header-action-btn']} onClick={() => Events.windowMaxmize()}>
            <Icon type="icon-fullscreen" />
          </div>
          <div className={styles['developer-container-header-action-btn']} onClick={() => Events.windowClose()}>
            <Icon type="icon-close" />
          </div>
        </div>
      </Header>

      <Layout>
        <Sider width={72} theme="light" className={styles['developer-container-sider']}>
          <div className={styles['developer-container-sider-menu']}>
            {MenuItems.map((item) => (
              <div
                className={cx([
                  styles['developer-container-sider-menu-item'],
                  activeKey === item.key ? styles['developer-container-sider-menu-item-active'] : '',
                ])}
                key={item.key}
                onClick={() => handleActive(item.key)}
              >
                <Icon className={styles['developer-container-sider-menu-item-icon']} size={24} type={item.icon} />
                <span className={styles['developer-container-sider-menu-item-label']}>{item.label}</span>
              </div>
            ))}
            <Divider style={{ margin: '5px 0' }} />
            {moreActiveTab ? (
              <div
                className={cx([
                  styles['developer-container-sider-menu-item'],
                  activeKey === moreActiveTab.key ? styles['developer-container-sider-menu-item-active'] : '',
                ])}
                onClick={() => handleActive(moreActiveTab.key)}
              >
                <Icon
                  className={styles['developer-container-sider-menu-item-icon']}
                  size={24}
                  type={moreActiveTab.icon}
                />
                <span className={styles['developer-container-sider-menu-item-label']}>{moreActiveTab.title}</span>
              </div>
            ) : null}
            <div
              className={cx([
                styles['developer-container-sider-menu-item'],
                activeKey === 'more' ? styles['developer-container-sider-menu-item-active'] : '',
              ])}
              onClick={() => handleActive('more')}
            >
              <AppstoreOutlined style={{ fontSize: '24px' }} />
              <span className={styles['developer-container-sider-menu-item-label']}>更多</span>
            </div>
          </div>
        </Sider>
        <Content className={styles['developer-container-content']}>
          <section className={styles['developer-container-content-keep-alive']}>
            {/* 为了保证在桌面端模拟页面 keep alive */}
            <Tabs activeKey={activeKey} items={tabItems} />
          </section>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
