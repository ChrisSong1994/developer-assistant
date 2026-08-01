import { Divider, Table } from 'antd';

const DATASOURCE = [
  {
    syntax: '$',
    description: '根对象或数组。',
  },
  {
    syntax: '@',
    description: '在过滤表达式内使用。指向被过滤的当前节点，以作进一步处理。',
  },
  {
    syntax: 'object.property',
    description: '点记法引用子元素',
  },
  {
    syntax: "['object'], ['property']",
    description: '括号记法引用子元素',
  },
  {
    syntax: '..property',
    description: '在所有可用对象中深度搜索指定的元索。总是返回一个列表，无论匹配个数。',
  },
  {
    syntax: '*',
    description: '通配符。选择对象或数组中的所有元素.不论其名称或索引。',
  },
  {
    syntax: '[n]',
    description: '从数组中选择第n个元素.索引从0开始。',
  },
  {
    syntax: '[n1.n2]',
    description: '选择数组中第n1和n2个元素。返回一个列表。',
  },
  {
    syntax: '[start:end:step]',
    description: '数组切片运算符',
  },
  {
    syntax: '?(expression)',
    description: '在对象或数组内选择所有满足布尔表达式的元素。返回一个列表。',
  },
  {
    syntax: '(expression)',
    description: '脚本表达式。',
  },
];

const COLUMNS = [
  {
    title: '语法',
    dataIndex: 'syntax',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
];
const CheatSheet = () => {
  return (
    <div
      className="cheat-sheet"
      style={{
        backgroundColor: '#fff',
        padding: '8px 12px',
        borderRadius: '12px',
        boxShadow: 'var(--ant-box-shadow-secondary)',
      }}
    >
      <Divider size="small">语法速查表</Divider>
      <Table columns={COLUMNS} dataSource={DATASOURCE} size="small" pagination={false} bordered />
    </div>
  );
};

export default CheatSheet;
