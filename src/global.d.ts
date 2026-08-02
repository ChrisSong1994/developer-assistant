// interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
//   dataTransfer: DataTransfer;
// }

import { IImageCompressInfo } from '@/main/modules/image';

declare global {
  interface Window {
    electronBridge?: {
      platform: string;
      on: (channel: 'imageCompress:item', callback: (data: IImageCompressInfo) => void) => () => void;
    };
    fullScreen: boolean;
  }
}

export {};
