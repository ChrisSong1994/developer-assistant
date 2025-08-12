import { Divider, Table } from 'antd';

// 正则语法提示
export const CHAR_DATASOURCE = [
  {
    syntax: '*',
    description: '表示匹配域的任意值',
    example: '在分这个域使用 *，即表示每分钟都会触发事件。',
  },
  {
    syntax: '？',
    description: '表示匹配域的任意值，但只能用在日期和星期两个域，因为这两个域会相互影响。',
    example:
      '要在每月的 20 号触发调度，不管每个月的 20 号是星期几，则只能使用如下写法：13 13 15 20 * ?。其中，因为日期域已经指定了 20 号，最后一位星期域只能用 ?，不能使用 *。如果最后一位使用 *，则表示不管星期几都会触发，与日期域的 20 号相斥，此时表达式不正确。',
  },
  {
    syntax: '-',
    description: '表示起止范围',
    example: '在分这个域使用 5-20，表示从 5 分到 20 分钟每分钟触发一次。',
  },
  {
    syntax: '/',
    description: '表示起始时间开始触发，然后每隔固定时间触发一次',
    example: '在分这个域使用 5/20，表示在第 5 分钟触发一次，之后每 20 分钟触发一次，即 5、 25、45 等分别触发一次。',
  },
  {
    syntax: ',',
    description: '表示枚举值',
    example: '在分这个域使用 5,20，则意味着在 5 和 20 分每分钟触发一次。',
  },
  {
    syntax: 'L',
    description: '表示最后，只能出现在日和星期两个域',
    example: '在星期这个域使用 5L，意味着在最后的一个星期四触发。',
  },
  {
    syntax: 'W',
    description: '表示有效工作日（周一到周五），只能出现在日这个域，系统将在离指定日期最近的有效工作日触发事件。',
    example:
      '在日这个域使用 5W，如果 5 号是星期六，则将在最近的工作日星期五，即 4 号触发。如果 5 号是星期天，则在 6 号（周一）触发；如果 5 号为工作日，则就在 5 号触发。另外，W 的最近寻找不会跨过月份。',
  },
  {
    syntax: 'LW',
    description: '表示最后一个工作日',
    example: '在日这个域使用 LW，意味着在本月的最后一个工作日触发。',
  },
  {
    syntax: '#',
    description: '表示每个月第几个星期几，只能出现在星期这个域',
    example: '在星期这个域使用 4#2，表示某月的第二个星期三，4 表示星期三，2 表示第二个。',
  },
];

const EXAMPLE_DATASOURCE = [
  {
    syntax: '*/5 * * * * ?',
    description: '每隔 5 秒执行一次',
  },
  {
    syntax: '0 */1 * * * ?',
    description: '每隔 1 分钟执行一次',
  },
  {
    syntax: '0 0 2 1 * ?',
    description: '每月 1 日的凌晨 2 点执行一次',
  },
  {
    syntax: '0 15 10 ? * MON-FRI',
    description: '周一到周五每天上午 10：15 执行作业',
  },
  {
    syntax: '0 15 10 ? 6L 2002-2006',
    description: '2002 年至 2006 年的每个月的最后一个星期五上午 10:15 执行作业',
  },
  {
    syntax: '0 0 23 * * ?',
    description: '每天 23 点执行一次',
  },
  {
    syntax: '0 0 1 * * ?',
    description: '每天凌晨 1 点执行一次',
  },
  {
    syntax: '0 0 0 ? * SUN',
    description: '每周星期天凌晨 0 点执行一次',
  },
  {
    syntax: '0 26,29,33 * * * ?',
    description: '在 26 分、29 分、33 分执行一次',
  },
  {
    syntax: '0 0 12 ? * WED',
    description: '每个星期三中午 12 点执行一次',
  },
  {
    syntax: '0 0 12 * * ?',
    description: '每天中午 12 点触发',
  },
  {
    syntax: '0 15 10 ? * 6L 2002-2005',
    description: '2002 年至 2005 年的每个月的最后一个星期五上午 10:15 执行作业',
  },
];

const CHAR_COLUMNS = [
  {
    title: '字符',
    dataIndex: 'syntax',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '示例',
    dataIndex: 'example',
  },
];

const EXAMPLE_COLUMNS = [
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
        height: 'calc(100vh - 150px)',
        overflow: 'auto',
        maxWidth: 'calc(100vw - 300px)',
      }}
    >
      <Divider size="small">字符说明</Divider>
      <Table columns={CHAR_COLUMNS} dataSource={CHAR_DATASOURCE} size="small" pagination={false} bordered />
      <Divider size="small">常用示例</Divider>
      <Table columns={EXAMPLE_COLUMNS} dataSource={EXAMPLE_DATASOURCE} size="small" pagination={false} bordered />
    </div>
  );
};

export default CheatSheet;
