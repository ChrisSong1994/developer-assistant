import { cx } from '@emotion/css';
import { Layout, Tabs, Divider } from 'antd';
import React, { FC, useLayoutEffect, useMemo } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';

import { useConfigData } from '@/renderer/hooks';
import ConfigMenu from '@/renderer/components/ConfigMenu';
import Events from '@/renderer/utils/events';
import Applications from '@/renderer/pages/Applications';
import logo from '../../assets/logo.png';
import Icon from '../components/Icon';
import styles from './index.module.less';
import routes from './routes';

const { Header, Content, Sider } = Layout;

interface TabItem {
  label: string;
  key: string;
  children: React.ReactNode;
}

const BaseLayout: FC = () => {
  const { data: configData, setData: setConfigData } = useConfigData();

  const activeKey = useMemo(() => {
    if (configData?.active_menu_key) {
      return configData.active_menu_key;
    }
    return configData?.sider_menus?.[0] || '';
  }, [configData]);

  const tabItems = useMemo(() => {
    const tabs: TabItem[] = routes.map((page: any) => ({
      label: '',
      key: page.key,
      children: React.createElement(page.component, { key: page.key }),
    }));
    tabs.push({
      label: '',
      key: 'more',
      children: <Applications />,
    });
    return tabs;
  }, [routes, configData]);

  // 菜单栏
  const menuItems = useMemo(() => {
    if (configData?.sider_menus?.length) {
      return configData?.sider_menus.map((key) => {
        const route: any = routes.find((item) => item.key === key);
        return {
          key: route.key,
          label: route.title,
          icon: route.icon,
        };
      });
    } else {
      return [];
    }
  }, [routes, configData]);

  // 激活tab
  const moreActiveTab = useMemo(() => {
    if (configData?.sider_menus && configData?.more_active_menu_key) {
      return routes.find((item: any) => {
        return !configData.sider_menus.includes(item.key) && item.key === configData.more_active_menu_key;
      });
    }
    return undefined;
  }, [configData?.sider_menus, configData?.more_active_menu_key]);

  const handleActive = (key: string) => {
    setConfigData({
      ...configData,
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
            {menuItems.map((item) => (
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
