import React, { useState } from 'react';
import type { FC } from 'react';
import { Layout, Menu, Tabs, Button } from 'antd';
import logo from '../assets/images/logo.svg';
import routes from './routes';
import Icon from '../components/Icon';
import styles from './index.less';

const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

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
  const handleSelect = ({ key }: any) => {
    const page = pages.filter((item) => item.key === key)[0];
    setActiveKey(key);
    setActiveTitle(page.title);
  };

  return (
    <Layout className={styles['developer-container']}>
      <Header className={styles['developer-container-header']}>
        <div className={styles['developer-container-header-logo']}>
          <img src={logo} /> <div>开发者助手</div>
        </div>
        <div className={styles['developer-container-header-action']}>
          <Icon className={styles['action-item']} type="icon-minus" />
          <Icon className={styles['action-item']} type="icon-quanping" />
          <Icon className={styles['action-item']} type="icon-guanbi" />
        </div>
      </Header>

      <Layout>
        <Sider width={220} theme="light" className={styles['developer-container-sider']}>
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            defaultOpenKeys={[defaultOpenKey]}
            style={{ borderRight: 0 }}
            items={MenuItems}
            onSelect={handleSelect}
          />
        </Sider>
        <Content className={styles['developer-container-content']}>
          <section className={styles['developer-container-content-keep-alive']}>
            {/* 为了保证在桌面端模拟页面 keep alive */}
            <Tabs activeKey={activeKey}>
              {pages.map((page) => {
                return (
                  <TabPane tab={page.key} key={page.key}>
                    {React.createElement(page.component)}
                  </TabPane>
                );
              })}
            </Tabs>
          </section>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
