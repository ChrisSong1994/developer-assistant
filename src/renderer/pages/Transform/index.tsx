import React, { Fragment, useMemo } from 'react';
import { Select } from 'antd';
import JsonToYaml from './JsonToYaml';
import YamlToJson from './YamlToJson';
import JsonToGo from './JsonToGo';
import JsonToJava from './JsonToJava';
import JsonToTypescript from './JsonToTypescript';
import JsonToMysql from './JsonToMysql';
import JsonToJsonSchema from './JsonToJsonSchema';
import JsObjectToJson from './JsObjectToJson';
import JsonToKotlin from './JsonToKotlin';

const TransformOptions = [
  {
    value: 'jsonToYaml',
    label: 'JSON 转 YAML',
    component: JsonToYaml,
  },
  {
    value: 'jsonToTypescript',
    label: 'JSON 转 Typescript',
    component: JsonToTypescript,
  },
  {
    value: 'jsonToGo',
    label: 'JSON 转 Go Struct',
    component: JsonToGo,
  },
  {
    value: 'jsonToJava',
    label: 'JSON 转 Java',
    component: JsonToJava,
  },
  {
    value: 'jsonToKotlin',
    label: 'JSON 转 Kotlin',
    component: JsonToKotlin,
  },
  {
    value: 'jsonToMysql',
    label: 'JSON 转 Mysql',
    component: JsonToMysql,
  },
  {
    value: 'JsonToJsonSchema',
    label: 'JSON 转 JSON Schema',
    component: JsonToJsonSchema,
  },
  {
    value: 'jsObjectToJson',
    label: 'Javascript Object 转 JSON',
    component: JsObjectToJson,
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
          style={{ width: 220, padding: '2px 0' }}
          onChange={setActiveKey}
          options={TransformOptions}
        />
      </div>
      {component && React.createElement(component)}
    </Fragment>
  );
};

export default Transform;
