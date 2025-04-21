import Color from '@/pages/Color';
import Diff from '@/pages/Diff';
import Encryption from '@/pages/Encryption';
import ImageEditor from '@/pages/ImageEditor';
import JsonComponent from '@/pages/Json';
import QrCode from '@/pages/QrCode';
import Regexp from '@/pages/Regexp';
import Transcoding from '@/pages/Transcoding';
import UrlParse from '@/pages/UrlParse';
import Transform from '@/pages/Transform';
import Markdown from '@/pages/Markdown';

const routes = [
  {
    key: 'Color',
    title: '颜色',
    icon: 'icon-color',
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
    icon: 'icon-picture',
    component: ImageEditor,
  },
  {
    key: 'Transform',
    title: '转换',
    icon: 'icon-transform',
    component: Transform,
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
    icon: 'icon-regexp',
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
    icon: 'icon-code',
    component: Transcoding,
  },
  {
    key: 'Encryption',
    title: '加解密',
    icon: 'icon-limitOfAuthority',
    component: Encryption,
  },
  // {
  //   key: 'UrlParse',
  //   title: 'URL解析',
  //   icon: 'icon-url',
  //   component: UrlParse,
  // },
  // {
  //   key: 'Markdown',
  //   title: 'Markdown',
  //   icon: 'icon-markdown',
  //   component: Markdown,
  // },
];

export default routes;
