import { MonacoDiffEditor } from 'react-monaco-editor';

const DiffEditor = () => {
  // useEffect(() => {
  //   diffEditorInstance.current = new AceDiff({
  //     // @ts-ignore
  //     ace: window.ace, // using Brace
  //     element: '.diff',
  //     left: {
  //       content: 'your first file content here',
  //     },
  //     right: {
  //       content: 'your second file content here',
  //     },
  //   });
  // }, []);

  return (
    <div id="diff" style={{ width: '100%', height: '100%', border: '1px solid #E9E9E9' }}>
      <MonacoDiffEditor
        height={500}
        language="text"
        value="your second file content here"
        original="your second file content here"
        options={{
          originalEditable: true,
          automaticLayout: false,
          scrollBeyondLastLine: false,
          diffWordWrap: 'on',
        }}
        onChange={console.log}
      />
    </div>
  );
};

export default DiffEditor;
