import React, { Fragment, useMemo } from 'react';
import { Select } from 'antd';
import JsonToYaml from './JsonToYaml';

const TransformOptions = [
  {
    value: 'jsonToYaml',
    label: 'JSON转YAML',
    component: JsonToYaml,
  },
];
const Transform = () => {
  const [activeKey, setActiveKey] = React.useState('jsonToYaml');

  const component = useMemo(() => {
    const com = TransformOptions.find((item) => item.value === activeKey)?.component;
    return com;
  }, [activeKey]);
  return (
    <Fragment>
      <div style={{ height: 32 }}>
        <span style={{ fontWeight: 500, fontSize: 14 }}>语言：</span>
        <Select
          showSearch
          value={activeKey}
          style={{ width: 140, padding: '2px 0' }}
          size="small"
          onChange={setActiveKey}
          options={TransformOptions}
        />
      </div>
      {/* <div className="transform-options">
        <Select
          defaultValue="jsonToYaml"
          style={{ width: 120 }}
          onChange={setActiveKey}
          options={TransformOptions}
        />
      </div> */}
      {component && React.createElement(component)}
    </Fragment>
  );
};

export default Transform;
