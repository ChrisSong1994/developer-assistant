import Color from '@/pages/Color';
import Encryption from '@/pages/Encryption';
import Image from '@/pages/Image';
import JsonComponent from '@/pages/Json';
import Regexp from '@/pages/Regexp';
import Setting from '@/pages/Setting';
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
    key: 'Encryption',
    title: '加解密',
    icon: 'icon-31mima',
    component: Encryption,
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
