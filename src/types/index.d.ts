declare module '*.css';
declare module '*.less';
declare module '*.md';
declare module '*.txt';
declare module '*.png';
declare module 'jsonlint-mod';
declare module 'qrcode-reader';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

declare global {
  interface Window {
    electronBridge: any;
  }
}

declare module 'react-copy-to-clipboard';
declare module 'react-color';
declare module 'react-color/es/helpers/color';
declare module 'react-color/es/components/common/Saturation';
declare module 'react-color/es/components/common/Hue';
declare module 'react-color/es/components/common/ColorWrap';
declare module 'react-color/es/components/google/GooglePointerCircle';
declare module 'react-color/es/components/google/GooglePointer';

interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
  dataTransfer: DataTransfer;
}
