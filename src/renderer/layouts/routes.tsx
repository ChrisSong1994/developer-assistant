import GenerateKey from '../pages/KeyTool/GenerateKey';
import Setting from '../pages/Setting';
import Color from '@/pages/Color';
import JsonComponent from '@/pages/Json';
import Image from '@/pages/Image';
import Regexp from '@/pages/Regexp';
import Transcoding from '@/pages/Transcoding';

const routes = [
  {
    key: 'Color',
    title: '颜色',
    icon: 'icon-yanse',
    component: Color,
  },
  {
    key: 'JSON',
    title: 'JSON',
    icon: 'icon-json',
    component: JsonComponent,
  },
  {
    key: 'Transcoding',
    title: '编解码',
    icon: 'icon-bianma',
    component: Transcoding,
  },
  {
    key: 'KeyTool',
    title: '加解密',
    icon: 'icon-31mima',
    component: GenerateKey,
  },
  {
    key: 'Regexp',
    title: '正则',
    icon: 'icon-regularExpression-o',
    component: Regexp,
  },
  {
    key: 'Image',
    title: '图片',
    icon: 'icon-tupian_huaban',
    component: Image,
  },
  {
    key: 'Setting',
    title: '设置',
    icon: 'icon-shezhi1',
    component: Setting,
  },
];

export default routes;
