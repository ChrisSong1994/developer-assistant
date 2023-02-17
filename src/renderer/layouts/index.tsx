import React, { useState } from 'react';
import type { FC } from 'react';
import { Layout, Tabs } from 'antd';
import { cx } from '@emotion/css';

import { minimize, maximize, winclose } from '@/servies';
import logo from '../assets/images/logo.svg';
import routes from './routes';
import Icon from '../components/Icon';
import styles from './index.less';

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
  const defaultOpenKey = routes[0].key;
  const defaultSelectKey = pages[0].key;
  const defaultTitle = pages[0].title;
  const [activeKey, setActiveKey] = useState<string>(defaultSelectKey);
  const [activeTitle, setActiveTitle] = useState<string>(defaultTitle);

  // 选择
  const handleSelect = (key: string) => {
    const page = pages.filter((item) => item.key === key)[0];
    setActiveKey(key);
    setActiveTitle(page.title);
  };

  const tabItems = pages.map((page: any) => ({
    label: '',
    key: page.key,
    children: React.createElement(page.component),
  }));

  return (
    <Layout className={styles['developer-container']}>
      <Header className={styles['developer-container-header']}>
        <div className={styles['developer-container-header-logo']}>
          <img src={logo} /> <div>开发者工具</div>
        </div>
        <div className={styles['developer-container-header-action']}>
          <div className={styles['developer-container-header-action-btn']}>
            <Icon className={styles['icon']} type="icon-minus" onClick={minimize} />
          </div>
          <div className={styles['developer-container-header-action-btn']}>
            <Icon className={styles['action-item']} type="icon-quanping" onClick={maximize} />
          </div>
          <div className={styles['developer-container-header-action-btn']}>
            <Icon className={styles['action-item']} type="icon-guanbi" onClick={winclose} />
          </div>
        </div>
      </Header>

      <Layout>
        <Sider width={75} theme="light" className={styles['developer-container-sider']}>
          <div className={styles['developer-container-sider-menu']}>
            {MenuItems.map((item) => (
              <div
                className={cx([
                  styles['developer-container-sider-menu-item'],
                  activeKey === item.key ? styles['developer-container-sider-menu-item-active'] : '',
                ])}
                key={item.key}
                onClick={() => handleSelect(item.key)}
              >
                <Icon size={21} type={item.icon} />
                <span>{item.label}</span>
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
