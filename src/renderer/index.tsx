import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import BaseLayout from './layouts';
import { init } from './init';
import { THEME_COLOR } from './constants';

import './styles/index.css';

init();

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          // Seed Token，影响范围大
          colorPrimary: THEME_COLOR,
        },
        components: {
          Select: {
            optionSelectedBg: '#f5f5f5',
          },
        },
      }}
    >
      <BaseLayout />
    </ConfigProvider>,
  );
}
