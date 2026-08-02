/**
 * 文本分析模块共享类型定义
 */

// 支持的 BPE 编码
export type TEncodingName = 'o200k_base' | 'cl100k_base' | 'p50k_base' | 'r50k_base';

// 成本币种
export type TCurrency = 'USD' | 'CNY';

// 价格表行（用户可编辑）
export interface IPriceRow {
  id: string;
  model: string; // 模型显示名，如 'GPT-4o'
  encoding: TEncodingName; // 计价所用编码
  inputPrice: number; // 输入单价（每 1M tokens）
  outputPrice: number; // 输出单价（每 1M tokens）
  currency: TCurrency;
}

// 计算后的成本行
export interface ICostRow extends IPriceRow {
  inputTokens: number;
  outputTokens: number;
  cost: number; // = inputTokens*inputPrice/1e6 + outputTokens*outputPrice/1e6
}

// 文本统计结果
export interface ITextStats {
  // —— 字符统计 ——
  charCount: number; // 总字符数（按 Unicode 码点）
  charCountNoSpace: number; // 去除全部空白字符后的字符数
  cjkCount: number; // 中文字符数
  letterCount: number; // 英文字母数
  digitCount: number; // 数字数
  punctuationCount: number; // 标点符号数
  whitespaceCount: number; // 空白字符数
  // —— 词 / 行 / 段 / 句 ——
  latinWordCount: number; // 英文/数字词数
  cjkBlockCount: number; // 连续汉字块数
  wordCount: number; // 总词数 = latinWordCount + cjkBlockCount
  uniqueWordCount: number; // 词种数（小写去重）
  lineCount: number; // 行数
  paragraphCount: number; // 段落数
  sentenceCount: number; // 句子数
  // —— 字节 / 熵 / 阅读 ——
  utf8Bytes: number; // UTF-8 字节数
  entropy: number; // Shannon 信息熵（bit/字符）
  readMinutes: number; // 预估阅读时长（分）
  readSeconds: number; // 预估阅读时长（秒）
  // —— 指纹 ——
  md5: string;
  sha1: string;
  sha256: string;
}

// 词频参数
export interface IFrequencyParams {
  topN: number; // Top-N
  minLength: number; // 最小词长
  filterStopWords: boolean; // 是否过滤停用词
}

// 词频单项
export interface IFrequencyItem {
  text: string;
  count: number;
}

// 词频分析结果
export interface IFrequencyResult {
  words: IFrequencyItem[]; // 高频词 Top-N（英文词 + 中文汉字块合并排序）
  hanzi: IFrequencyItem[]; // 高频汉字 Top-N（单个汉字）
}
