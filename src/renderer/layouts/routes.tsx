import Color from '@/pages/Color';
import Diff from '@/pages/Diff';
import Encryption from '@/pages/Encryption';
import Image from '@/pages/Image';
import JsonComponent from '@/pages/Json';
import QrCode from '@/pages/QrCode';
import Regexp from '@/pages/Regexp';
import Transcoding from '@/pages/Transcoding';
import UrlParse from '@/pages/UrlParse';
import Transform from '@/pages/Transform';

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
    key: 'Image',
    title: '图片',
    icon: 'icon-tupian_huaban',
    component: Image,
  },
  {
    key: 'Transform',
    title: '转换',
    icon: 'icon-zhuanhuan',
    component: Transform,
  },
  {
    key: 'UrlParse',
    title: 'URL解析',
    icon: 'icon-url',
    component: UrlParse,
  },
  {
    key: 'Diff',
    title: 'Diff',
    icon: 'icon-diff',
    component: Diff,
  },
  {
    key: 'Regexp',
    title: '正则',
    icon: 'icon-regularExpression-o',
    component: Regexp,
  },
  {
    key: 'QrCode',
    title: '二维码',
    icon: 'icon-qrcode',
    component: QrCode,
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
];

export default routes;
