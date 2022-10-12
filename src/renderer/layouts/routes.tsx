import Icon from '../components/Icon';

import GenerateKey from '../pages/KeyTool/GenerateKey';
import Setting from '../pages/Setting';

const routes = [
  {
    key: 'KeyTool',
    title: '密钥工具',
    icon: <Icon type="icon-key" />,
    component: GenerateKey,
  },
  {
    key: 'Setting',
    title: '设置',
    icon: <Icon type="icon-shezhi1" />,
    component: Setting,
  },
];

export default routes;
