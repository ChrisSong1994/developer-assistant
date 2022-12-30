import Icon from '../components/Icon';

import GenerateKey from '../pages/KeyTool/GenerateKey';
import Setting from '../pages/Setting';
import Color from '../pages/Color';

const routes = [
  {
    key: 'KeyTool',
    title: '密钥工具',
    icon: <Icon type="icon-key" />,
    component: GenerateKey,
  },
  {
    key: 'Color',
    title: '色彩处理',
    icon: <Icon type="icon-shezhi1" />,
    component: Color,
  },
  {
    key: 'Setting',
    title: '设置',
    icon: <Icon type="icon-shezhi1" />,
    component: Setting,
  },
];

export default routes;
