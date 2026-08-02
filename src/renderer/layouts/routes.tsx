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
import ImageCompress from '@/renderer/pages/ImageCompress';
import ImageConvert from '@/renderer/pages/ImageConvert';
import DecimalConversion from '@/renderer/pages/DecimalConversion';
import CronParser from '@/renderer/pages/CronParser';
// import OCR from '@/renderer/pages/OCR';
import AstExplorer from '@/renderer/pages/AstExplorer';
import TextAnalysis from '@/renderer/pages/TextAnalysis';
import JwtDecode from '@/renderer/pages/JwtDecode';

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
    key: 'ImageCompress',
    title: '图片压缩',
    icon: 'icon-picture',
    category: ToolCategory.IMAGE,
    component: ImageCompress,
  },
  {
    key: 'ImageConvert',
    title: '图片格式转换',
    icon: 'icon-picture',
    category: ToolCategory.IMAGE,
    component: ImageConvert,
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
    key: 'DecimalConversion',
    title: '进制转换',
    icon: 'icon-binary',
    category: ToolCategory.CODING,
    component: DecimalConversion,
  },
  {
    key: 'Markdown',
    title: 'Markdown',
    icon: 'icon-markdown',
    category: ToolCategory.TEXT,
    component: Markdown,
  },
  {
    key: 'CronParser',
    title: 'Cron 解析',
    icon: 'icon-cron',
    category: ToolCategory.TEXT,
    component: CronParser,
  },
  // {
  //   key: 'OCR',
  //   title: 'OCR',
  //   icon: 'icon-ocr',
  //   category: ToolCategory.TEXT,
  //   component: OCR,
  // },
  {
    key: 'AstExplorer',
    title: 'AST',
    icon: 'icon-yufaxiuzheng',
    category: ToolCategory.TEXT,
    component: AstExplorer,
  },
  {
    key: 'TextAnalysis',
    title: '文本分析',
    icon: 'icon-wenbenfenxi',
    category: ToolCategory.TEXT,
    component: TextAnalysis,
  },
  {
    key: 'JwtDecode',
    title: 'JWT 解码',
    icon: 'icon-key',
    category: ToolCategory.CODING,
    component: JwtDecode,
  },
];

export const MenuKeys = routes.map((item) => item.key);

export default routes;
