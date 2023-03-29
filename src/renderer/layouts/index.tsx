import { cx } from '@emotion/css';
import { Layout, Tabs } from 'antd';
import type { FC } from 'react';
import React, { useState } from 'react';

import { maximize, minimize, winclose } from '@/servies';
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
          <div className={styles['developer-container-header-action-btn']} onClick={minimize}>
            <Icon type="icon-minus" />
          </div>
          <div className={styles['developer-container-header-action-btn']} onClick={maximize}>
            <Icon type="icon-quanping" />
          </div>
          <div className={styles['developer-container-header-action-btn']} onClick={winclose}>
            <Icon type="icon-guanbi" />
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
