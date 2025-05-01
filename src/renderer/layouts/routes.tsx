import Color from '@/renderer/pages/Color';
import Diff from '@/renderer/pages/Diff';
import Encryption from '@/renderer/pages/Encryption';
import ImageEditor from '@/renderer/pages/ImageEditor';
import JsonComponent from '@/renderer/pages/Json';
import QrCode from '@/renderer/pages/QrCode';
import Regexp from '@/renderer/pages/Regexp';
import Transcoding from '@/renderer/pages/Transcoding';
import UrlParse from '@/renderer/pages/UrlParse';
import Transform from '@/renderer/pages/Transform';
import Markdown from '@/renderer/pages/Markdown';

export enum ToolCategory {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  CODING = 'CODING',
  OTHER = 'OTHER',
}

const routes = [
  {
    key: 'Color',
    title: '颜色',
    icon: 'icon-color',
    category: ToolCategory.TEXT,
    component: Color,
  },
  {
    key: 'JSON',
    title: 'JSON',
    icon: 'icon-json',
    category: ToolCategory.TEXT,
    component: JsonComponent,
  },
  {
    key: 'Image',
    title: '图片',
    icon: 'icon-picture',
    category: ToolCategory.IMAGE,
    component: ImageEditor,
  },
  {
    key: 'Transform',
    title: '转换',
    icon: 'icon-transform',
    category: ToolCategory.TEXT,
    component: Transform,
  },

  {
    key: 'Diff',
    title: 'Diff',
    icon: 'icon-diff',
    category: ToolCategory.TEXT,
    component: Diff,
  },
  {
    key: 'Regexp',
    title: '正则',
    icon: 'icon-regexp',
    category: ToolCategory.TEXT,
    component: Regexp,
  },
  {
    key: 'QrCode',
    title: '二维码',
    icon: 'icon-qrcode',
    category: ToolCategory.IMAGE,
    component: QrCode,
  },
  {
    key: 'Transcoding',
    title: '编解码',
    icon: 'icon-code',
    category: ToolCategory.CODING,
    component: Transcoding,
  },
  {
    key: 'Encryption',
    title: '加解密',
    icon: 'icon-limitOfAuthority',
    category: ToolCategory.CODING,
    component: Encryption,
  },
  {
    key: 'UrlParse',
    title: 'URL解析',
    icon: 'icon-url',
    category: ToolCategory.CODING,
    component: UrlParse,
  },
  {
    key: 'Markdown',
    title: 'Markdown',
    icon: 'icon-markdown',
    category: ToolCategory.TEXT,
    component: Markdown,
  },
];

export default routes;
