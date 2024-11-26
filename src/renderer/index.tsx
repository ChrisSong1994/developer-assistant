import React from 'react';
import ReactDOM from 'react-dom/client';
import BaseLayout from './layouts';
import { init } from './init';

import './global.less';

// init();

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <BaseLayout />
    </React.StrictMode>,
  );
}
