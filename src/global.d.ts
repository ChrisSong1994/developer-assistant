// interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
//   dataTransfer: DataTransfer;
// }

declare global {
  interface Window {
    electronBridge?: {
      platform: string;
    };
    fullScreen: boolean;
  }
}

export {};
