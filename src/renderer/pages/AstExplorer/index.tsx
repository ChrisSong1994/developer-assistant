import { Splitter } from 'antd';

const EDITOR_HEIGHT_PADDING = 100;
const AstExplorer = () => {
  return (
    <div className="ocr">
        <div className="ast-explorer-header">
          <div className="ast-explorer-title">AST Explorer</div>
        </div>
      <Splitter style={{ height: `calc(100vh - ${EDITOR_HEIGHT_PADDING}px)` }}>
        <Splitter.Panel defaultSize="40%" min="20%" max="70%">
          asass
        </Splitter.Panel>
        <Splitter.Panel>asas</Splitter.Panel>
      </Splitter>
    </div>
  );
};

export default AstExplorer;
