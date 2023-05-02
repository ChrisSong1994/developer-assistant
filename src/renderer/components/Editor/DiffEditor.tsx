// @ts-ignore
import AceDiff from 'ace-diff';
import 'ace-diff/dist/ace-diff.min.css';
import { useEffect, useLayoutEffect, useRef } from 'react';

interface IProps {
  style?: Record<string, any>;
  options?: Record<string, any>;
  language?: string;
}

const DiffEditor = (props: IProps) => {
  const { language } = props;
  const editorRef = useRef<any>(null);
  const elementRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.editors.left.ace.getSession().setMode(`ace/mode/${language}`);
      editorRef.current.editors.right.ace.getSession().setMode(`ace/mode/${language}`);
    }
  }, [language]);

  useLayoutEffect(() => {
    editorRef.current = new AceDiff({
      element: '#diff_editor',
      left: {
        moge: 'ace/mode/json',
        editable: true,
        content: JSON.stringify({ a: 1 }, null, 2),
        copyLinkEnabled: false,
      },
      right: {
        moge: 'ace/mode/json',
        editable: true,
        content: JSON.stringify({ a: 3 }, null, 2),
        copyLinkEnabled: false,
      },
    });
  }, []);

  return (
    <div
      id="diff_editor"
      ref={elementRef}
      style={{ width: '100%', height: '100%', position: 'relative', border: '1px solid #e9e9e9' }}
    ></div>
  );
};

export default DiffEditor;
