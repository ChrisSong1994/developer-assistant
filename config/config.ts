import { defineConfig } from 'umi';
import electronBuilder from './electronBuilder';

export default defineConfig({
  fastRefresh: {},
  routes: [
    {
      path: '/',
      component: '@/layouts',
    },
  ],
  lessLoader: {
    modifyVars: {
      'primary-color': '#1D2E54',
      'link-color': '#1DA57A',
      'border-radius-base': '4px',
    },
    javascriptEnabled: true,
  },
  electronBuilder,
});
