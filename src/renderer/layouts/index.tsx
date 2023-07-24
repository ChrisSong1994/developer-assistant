import { cx } from '@emotion/css';
import { Layout, Tabs } from 'antd';
import React, { FC, useLayoutEffect, useRef, useState } from 'react';

import ConfigMenu from '@/components/ConfigMenu';
import EventBus, { EEventBusName } from '@/utils/eventBus';
import Events from '@/utils/events';
import logo from '../../assets/logo.png';
import Icon from '../components/Icon';
import styles from './index.less';
import routes from './routes';

const { Header, Content, Sider } = Layout;

// 菜单栏
const MenuItems = routes.map((item) => {
  return {
    key: item.key,
    label: item.title,
    icon: item.icon,
  };
});

// 页面
const pages = routes.reduce((pre: any[], cur: any) => {
  if (cur.component) {
    return [...pre, { ...cur }];
  }
  if (cur.children) {
    return [...pre, ...cur.children];
  }
  return pre;
}, []);

const BaseLayout: FC = () => {
  const defaultSelectKey = pages[0].key;
  const keyRef = useRef<number>(new Date().getTime());
  const [activeKey, setActiveKey] = useState<string>(defaultSelectKey);

  // 页面刷新
  const handleUpdate = () => (keyRef.current = new Date().getTime());

  useLayoutEffect(() => {
    EventBus.on(EEventBusName.CLEAR_LOCAL_DATA, handleUpdate);
    setTimeout(Events.windowRenderReady, 1000);
    return () => {
      EventBus.off(EEventBusName.CLEAR_LOCAL_DATA, handleUpdate);
    };
  }, []);

  const tabItems = pages.map((page: any) => ({
    label: '',
    key: page.key,
    children: React.createElement(page.component, { key: page.key === 'Setting' ? page.key : keyRef.current }), // 除了设置页其他页面强刷
  }));

  return (
    <Layout className={styles['developer-container']}>
      <Header className={styles['developer-container-header']}>
        <div className={styles['developer-container-header-logo']}>
          <img src={logo} /> <div>开发者助手</div>
        </div>
        <div className={styles['developer-container-header-action']}>
          <ConfigMenu>
            <div className={styles['developer-container-header-action-btn']}>
              <Icon type="icon-gengduo" />
            </div>
          </ConfigMenu>
          <div className={styles['developer-container-header-action-btn']} onClick={() => Events.windowMinimize()}>
            <Icon type="icon-minus" />
          </div>
          <div className={styles['developer-container-header-action-btn']} onClick={() => Events.windowMaxmize()}>
            <Icon type="icon-quanping" />
          </div>
          <div className={styles['developer-container-header-action-btn']} onClick={() => Events.windowClose()}>
            <Icon type="icon-guanbi" />
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
                onClick={() => setActiveKey(item.key)}
              >
                <Icon className={styles['developer-container-sider-menu-item-icon']} size={24} type={item.icon} />
                <span className={styles['developer-container-sider-menu-item-label']}>{item.label}</span>
              </div>
            ))}
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
