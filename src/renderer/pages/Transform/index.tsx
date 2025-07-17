import React, { Fragment, useMemo } from 'react';
import { Select } from 'antd';
import JsonToYaml from './JsonToYaml';
import YamlToJson from './YamlToJson';
import JsonToGo from './JsonToGo';
import JsonToTypescript from './JsonToTypescript';

const TransformOptions = [
  {
    value: 'jsonToYaml',
    label: 'JSON 转 YAML',
    component: JsonToYaml,
  },

  {
    value: 'jsonToGo',
    label: 'JSON 转 Go Struct',
    component: JsonToGo,
  },

  {
    value: 'jsonToTypescript',
    label: 'JSON 转 Typescript',
    component: JsonToTypescript,
  },
  {
    value: 'yamlToJson',
    label: 'YAML 转 JSON',
    component: YamlToJson,
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
          value={activeKey}
          style={{ width: 200, padding: '2px 0' }}
          onChange={setActiveKey}
          options={TransformOptions}
        />
      </div>
      {component && React.createElement(component)}
    </Fragment>
  );
};

export default Transform;
