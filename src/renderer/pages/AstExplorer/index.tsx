import { useEffect, useRef } from 'react';
import { Select, Space, Spin, Typography, Splitter, Switch } from 'antd';
import { categories } from './parsers';
import { BaseEditor, EEditorLanguage } from '@/renderer/components/Editor';
import { safeStringify } from '@/renderer/utils/safeStringify';
import Tree from './components/visualization/Tree';
import { useAstExplorerStore } from './store';

const { Panel } = Splitter;
const { Text } = Typography;

const AstExplorer = () => {
  const {
    category,
    parser,
    transformer,
    code,
    ast,
    transformCode,
    transformedCode,
    transformEnabled,
    viewType,
    loading,
    error,
    transformError,
    setCategory,
    setParser,
    setTransformer,
    setCode,
    setAst,
    setTransformCode,
    setTransformedCode,
    setTransformEnabled,
    setViewType,
    setLoading,
    setError,
    setTransformError,
  } = useAstExplorerStore();

  const parserInstanceRef = useRef<any>(null);
  const transformerInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load parser when parser changes
    setLoading(true);
    parser
      .loadParser()
      .then((instance) => {
        parserInstanceRef.current = instance;
        setLoading(false);
        parseCode();
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [parser]);

  useEffect(() => {
    if (transformer && transformEnabled) {
      setLoading(true);
      transformer
        .loadTransformer()
        .then((instance) => {
          transformerInstanceRef.current = instance;
          setTransformCode(transformer.defaultTransform);
          setLoading(false);
          runTransform();
        })
        .catch((err) => {
          console.error(err);
          setTransformError(err.message);
          setLoading(false);
        });
    } else {
      setTransformedCode('');
      setTransformError(null);
    }
  }, [transformer, transformEnabled]);

  useEffect(() => {
    parseCode();
    if (transformEnabled) {
      runTransform();
    }
  }, [code, parser]);

  useEffect(() => {
    if (transformEnabled) {
      runTransform();
    }
  }, [transformCode]);

  const parseCode = () => {
    if (!parserInstanceRef.current) return;
    try {
      const result = parser.parse(parserInstanceRef.current, code);
      setAst(result);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const runTransform = () => {
    if (!transformerInstanceRef.current || !transformer || !transformEnabled) return;
    try {
      const result = transformer.transform(transformerInstanceRef.current, transformCode, code);
      setTransformedCode(result);
      setTransformError(null);
    } catch (err: any) {
      console.error(err);
      setTransformError(err.message);
    }
  };

  const handleCategoryChange = (val: string) => {
    const cat = categories.find((c) => c.id === val);
    if (cat) {
      setCategory(cat);
      setParser(cat.parsers[0]);
      setTransformer(undefined);
      setTransformEnabled(false);
      setTransformCode('');
      setTransformedCode('');
      setTransformError(null);
      if (cat.codeExample) {
        setCode(cat.codeExample.trim());
      }
    }
  };

  const handleParserChange = (val: string) => {
    const p = category.parsers.find((p) => p.id === val);
    if (p) setParser(p);
  };

  const handleTransformerChange = (val: string) => {
    const t = category.transformers?.find((t) => t.id === val);
    setTransformer(t);
  };

  const handleTransformEnabledChange = (checked: boolean) => {
    setTransformEnabled(checked);
    if (checked && !transformer && category.transformers?.length) {
      setTransformer(category.transformers[0]);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '8px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Space>
          <Text strong>Language:</Text>
          <Select
            size="small"
            value={category.id}
            onChange={handleCategoryChange}
            options={categories.map((c) => ({ label: c.displayName, value: c.id }))}
            style={{ width: 120 }}
          />
          <Text strong>Parser:</Text>
          <Select
            size="small"
            value={parser.id}
            onChange={handleParserChange}
            options={category.parsers.map((p) => ({ label: p.displayName, value: p.id }))}
            style={{ width: 160 }}
          />

          {category.transformers && category.transformers.length > 0 && (
            <Space>
              <Text strong>Transform:</Text>
              <Switch size="small" value={transformEnabled} onChange={handleTransformEnabledChange}></Switch>
            </Space>
          )}

          {transformEnabled && category.transformers && (
            <Select
              value={transformer?.id}
              size="small"
              onChange={handleTransformerChange}
              options={category.transformers.map((t) => ({ label: t.displayName, value: t.id }))}
              style={{ width: 160 }}
              placeholder="Select Transformer"
            />
          )}
        </Space>
        {loading && <Spin size="small" />}
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Splitter style={{ height: 'calc(-110px + 100vh)' }}>
          <Panel defaultSize="50%" min="20%">
            <Splitter layout="vertical">
              <Panel defaultSize="50%" min="20%">
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      padding: '4px 8px',
                      background: '#fafafa',
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    Source Code
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <BaseEditor
                      language={EEditorLanguage.JAVASCRIPT}
                      value={code}
                      onChange={setCode}
                      options={{ minimap: { enabled: false } }}
                    />
                  </div>
                </div>
              </Panel>
              {transformEnabled && (
                <Panel defaultSize="50%" min="20%">
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        padding: '4px 8px',
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      Transform Code
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <BaseEditor
                        language={EEditorLanguage.JAVASCRIPT}
                        value={transformCode}
                        onChange={setTransformCode}
                        options={{ minimap: { enabled: false } }}
                      />
                    </div>
                  </div>
                </Panel>
              )}
            </Splitter>
          </Panel>
          <Panel defaultSize="50%" min="20%">
            <Splitter layout="vertical">
              <Panel defaultSize={transformEnabled ? '50%' : '100%'} min="20%">
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      padding: '4px 8px',
                      background: '#fafafa',
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>AST</span>
                    <Space size="small">
                      <Select
                        size="small"
                        value={viewType}
                        onChange={setViewType}
                        options={[
                          { label: 'Tree', value: 'tree' },
                          { label: 'JSON', value: 'json' },
                        ]}
                        style={{ width: 80 }}
                      />
                      {error && <span style={{ color: 'red' }}>Error</span>}
                    </Space>
                  </div>
                  {error && (
                    <div
                      style={{
                        padding: 8,
                        color: 'red',
                        borderBottom: '1px solid #ffccc7',
                        background: '#fff2f0',
                        maxHeight: '100px',
                        overflow: 'auto',
                      }}
                    >
                      {error}
                    </div>
                  )}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    {viewType === 'json' ? (
                      <BaseEditor
                        language={EEditorLanguage.JSON}
                        value={safeStringify(ast, 2)}
                        options={{ readOnly: true, minimap: { enabled: false }, wordWrap: 'off' }}
                      />
                    ) : (
                      <div style={{ height: '100%', overflow: 'auto' }}>
                        <Tree
                          parseResult={{
                            ast: ast,
                            treeAdapter: {
                              type: category.id === 'javascript' || category.id === 'typescript' ? 'estree' : 'json',
                              options: {}
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
              {transformEnabled && (
                <Panel defaultSize="50%" min="20%">
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        padding: '4px 8px',
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Transformed Code</span>
                      {transformError && <span style={{ color: 'red' }}>Error</span>}
                    </div>
                    {transformError && (
                      <div
                        style={{
                          padding: 8,
                          color: 'red',
                          borderBottom: '1px solid #ffccc7',
                          background: '#fff2f0',
                          maxHeight: '100px',
                          overflow: 'auto',
                        }}
                      >
                        {transformError}
                      </div>
                    )}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <BaseEditor
                        language={EEditorLanguage.JAVASCRIPT}
                        value={transformedCode}
                        options={{ readOnly: true, minimap: { enabled: false } }}
                      />
                    </div>
                  </div>
                </Panel>
              )}
            </Splitter>
          </Panel>
        </Splitter>
      </div>
    </div>
  );
};

export default AstExplorer;
