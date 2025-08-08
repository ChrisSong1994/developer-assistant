import { Divider, Table } from 'antd';

// 正则语法提示
export const DATASOURCE = [
  {
    syntax: '.',
    description: '除换行符以外的所有字符。',
  },
  {
    syntax: '^',
    description: '字符串开头。',
  },
  {
    syntax: '$',
    description: '字符串结尾。',
  },
  {
    syntax: '*',
    description: '匹配前面的子表达式零次或多次。',
  },
  {
    syntax: '+',
    description: '匹配前面的子表达式一次或多次。',
  },
  {
    syntax: '?',
    description: '匹配前面的子表达式零次或一次。',
  },
  {
    syntax: '{n}',
    description: '匹配确定的 n 次。',
  },
  {
    syntax: '{n,}',
    description: '至少匹配 n 次。',
  },
  {
    syntax: '{n,m}',
    description: '匹配最少 n 次且最多 m 次。',
  },
  {
    syntax: '[ ]',
    description: '字符集合，匹配方括号中的任意一个字符。',
  },
  {
    syntax: '[^ ]',
    description: '否定字符集合，匹配除方括号中的字符以外的任意字符。',
  },
  {
    syntax: '( )',
    description: '分组，将括号内的内容作为一个整体，可以用于反向引用等。',
  },
  {
    syntax: '|',
    description: '或，匹配前面的或后面的子表达式。',
  },
  {
    syntax: '\\',
    description: '转义字符，用于匹配特殊字符。',
  },
  {
    syntax: '\\d',
    description: '匹配一个数字字符，等效于[0-9]',
  },
  {
    syntax: '\\D',
    description: '匹配一个非数字字符，等效于[^0-9]',
  },
  {
    syntax: '\\w',
    description: '匹配字母、数字或下划线，等效于[A - Za - z0 - 9_]',
  },
  {
    syntax: '\\W',
    description: '匹配非字母、数字和下划线的字符，等效于[^A - Za - z0 - 9_]',
  },
  {
    syntax: '\\s',
    description: '匹配任何空白字符，包括空格、制表符、换页符等，等效于[ \f\n\r\t\v]',
  },
  {
    syntax: '\\S',
    description: '匹配任何非空白字符，等效于[^ \f\n\r\t\v]',
  },
  {
    syntax: '(?=pattern)',
    description: '正向肯定预查，匹配后面跟着指定模式pattern的位置',
  },
  {
    syntax: '(?!pattern)',
    description: '正向否定预查，匹配后面不跟着指定模式pattern的位置',
  },
  {
    syntax: '(?<=pattern)',
    description: '反向肯定预查，匹配前面是指定模式pattern的位置',
  },
  {
    syntax: '(?<!pattern)',
    description: '反向否定预查，匹配前面不是指定模式pattern的位置',
  },
];

const EXAMPLE_DATASOURCE = [
  {
    description: '正整数',
    syntax: '^d+',
  },
  {
    description: '英文和数字',
    syntax: '^[a-zA-Z0-9]+$',
  },
  {
    description: '日期（YYYY-MM-dd）',
    syntax: '/([12]d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]d|3[01]))/',
  },
  {
    description: '手机号',
    syntax: '^(?:0|86|＋?86)?1[3-9]d{9}$',
  },
  {
    description: '邮政编码',
    syntax: '/^[0-9]{6}$/',
  },
  {
    description: '身份证号码（2 代）',
    syntax: '^[1-9]d{5}(18|19|20)d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)d{3}[0-9Xx]$',
  },
  {
    description: '电子邮箱',
    syntax: '^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6})*$',
  },
  {
    description: 'URL',
    syntax: '^(https?://)?(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$',
  },
  {
    description: 'HTML Tags',
    syntax: '</?[ws]*>|<.+[W]>',
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

const EXAMPLE_COLUMNS = [
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '语法',
    dataIndex: 'syntax',
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
        height: 'calc(100vh - 150px)',
        overflow: 'auto',
      }}
    >
      <Divider size="small">语法速查表</Divider>
      <Table columns={COLUMNS} dataSource={DATASOURCE} size="small" pagination={false} bordered />
      <Divider size="small">常用示例</Divider>
      <Table columns={EXAMPLE_COLUMNS} dataSource={EXAMPLE_DATASOURCE} size="small" pagination={false} bordered />
    </div>
  );
};

export default CheatSheet;
