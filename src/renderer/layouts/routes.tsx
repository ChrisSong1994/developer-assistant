import Icon from '../components/Icon';

import GenerateKey from '../pages/KeyTool/GenerateKey';
import Setting from '../pages/Setting';
import Color from '@/pages/Color';
import JsonComponent from '@/pages/Json';
import Image from '@/pages/Image';
import Regexp from '@/pages/Regexp';
import Transcoding from '@/pages/Transcoding';

const routes = [
  {
    key: 'KeyTool',
    title: '密钥工具',
    icon: <Icon type="icon-31mima" />,
    component: GenerateKey,
  },
  {
    key: 'Color',
    title: '色彩处理',
    icon: <Icon type="icon-yanse" />,
    component: Color,
  },
  {
    key: 'Json',
    title: 'Json 处理',
    icon: <Icon type="icon-json" />,
    component: JsonComponent,
  },
  {
    key: 'Regexp',
    title: '正则表达式',
    icon: <Icon type="icon-regularExpression-o" />,
    component: Regexp,
  },
  {
    key: 'Image',
    title: '图片处理',
    icon: <Icon type="icon-tupian_huaban" />,
    component: Image,
  },
  {
    key: 'Transcoding',
    title: '编解码',
    icon: <Icon type="icon-bianma" />,
    component: Transcoding,
  },
  {
    key: 'Setting',
    title: '设置',
    icon: <Icon type="icon-shezhi1" />,
    component: Setting,
  },
];

export default routes;
