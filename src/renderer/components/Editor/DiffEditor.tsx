// @ts-ignore
import AceDiff from 'ace-diff';
import 'ace-diff/dist/ace-diff.min.css';
import { useLayoutEffect, useRef } from 'react';

interface IProps {
  style?: Record<string, any>;
  options?: Record<string, any>;
}

const DiffEditor = (props: IProps) => {
  const editorRef = useRef<any>(null);
  const elementRef = useRef<any>(null);

  useLayoutEffect(() => {
    editorRef.current = new AceDiff({
      // moge: 'ace/mode/json',
      element: '#diff',
      left: {
        editable: true,
        content: JSON.stringify({ a: 1 }, null, 2),
        copyLinkEnabled: false,
      },
      right: {
        editable: true,
        content: JSON.stringify({ a: 3 }, null, 2),
        copyLinkEnabled: false,
      },
    });
  }, []);

  return <div id="diff" ref={elementRef} style={{ width: '100%', height: '100%', border: '1px solid #E9E9E9' }}></div>;
};

export default DiffEditor;
