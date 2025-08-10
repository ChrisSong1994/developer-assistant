
// Cron字段模型
export interface CronField {
  name: string;
  description: string;
  value: string;
  parsed: string;
  valid: boolean;
  error?: string;
  allowChars?: string;
}  
  
  // 初始化字段定义
 export  const cronFields: CronField[] = [
    { name: '秒', description: '0-59', allowChars: '- * /', value: '', parsed: '', valid: true },
    { name: '分', description: '0-59', allowChars: '- * /', value: '', parsed: '', valid: true },
    { name: '时', description: '0-23', allowChars: '- * /', value: '', parsed: '', valid: true },
    {
      name: '日',
      description: '1-31',
      allowChars: '- * ? / L W C',
      value: '',
      parsed: '',
      valid: true,
    },
    { name: '月', description: '1-12 或 JAN-DEC', allowChars: 'JAN-DEC - * /', value: '', parsed: '', valid: true },
    {
      name: '周',
      description: '0-6 或 SUN-SAT (0和7都代表周日)',
      allowChars: 'SUN-SAT - * ? / L C #',
      value: '',
      parsed: '',
      valid: true,
    },
    { name: '年（可选）', description: '可选，1970-2099', allowChars: ', - * /', value: '', parsed: '', valid: true },
  ];
