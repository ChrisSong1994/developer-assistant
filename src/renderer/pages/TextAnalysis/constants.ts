/**
 * 文本分析模块常量
 */
import { IPriceRow, TCurrency, TEncodingName } from './types';

// 币种符号
export const CURRENCY_SYMBOL: Record<TCurrency, string> = {
  USD: '$',
  CNY: '¥',
};

// 阅读速度（每分钟）
export const READING_SPEED = {
  cjkCharsPerMinute: 400, // 中文 400 字/分钟
  latinWordsPerMinute: 200, // 英文 200 词/分钟
};

// 编码选项（antd Select 分组：常见模型 / 原始编码）
export const ENCODING_MODEL_OPTIONS: Array<{
  label: string;
  group: '常见模型' | '原始编码';
  value: TEncodingName;
}> = [
  { label: 'GPT-4o / GPT-4.1 / GPT-5 / o1 / o3 / Claude(近似)', value: 'o200k_base', group: '常见模型' },
  { label: 'GPT-4 / GPT-3.5-Turbo', value: 'cl100k_base', group: '常见模型' },
  { label: 'text-davinci-002/003 / code-davinci-002', value: 'p50k_base', group: '常见模型' },
  { label: 'GPT-2 / text-davinci-001', value: 'r50k_base', group: '常见模型' },
  { label: 'o200k_base', value: 'o200k_base', group: '原始编码' },
  { label: 'cl100k_base', value: 'cl100k_base', group: '原始编码' },
  { label: 'p50k_base', value: 'p50k_base', group: '原始编码' },
  { label: 'r50k_base', value: 'r50k_base', group: '原始编码' },
];

// 所有编码（去重）
export const ALL_ENCODINGS: TEncodingName[] = ['o200k_base', 'cl100k_base', 'p50k_base', 'r50k_base'];

// 默认价格表（每 1M tokens，默认值仅供参考，以官方最新定价为准）
export const DEFAULT_PRICE_TABLE: IPriceRow[] = [
  { id: 'gpt-5', model: 'GPT-5', encoding: 'o200k_base', inputPrice: 1.25, outputPrice: 10.0, currency: 'USD' },
  { id: 'gpt-5-mini', model: 'GPT-5 mini', encoding: 'o200k_base', inputPrice: 0.25, outputPrice: 2.0, currency: 'USD' },
  { id: 'gpt-5-nano', model: 'GPT-5 nano', encoding: 'o200k_base', inputPrice: 0.05, outputPrice: 0.4, currency: 'USD' },
  { id: 'gpt-5-pro', model: 'GPT-5 pro', encoding: 'o200k_base', inputPrice: 2.0, outputPrice: 12.0, currency: 'USD' },
  { id: 'gpt-4o', model: 'GPT-4o', encoding: 'o200k_base', inputPrice: 2.5, outputPrice: 10.0, currency: 'USD' },
  { id: 'gpt-4o-mini', model: 'GPT-4o mini', encoding: 'o200k_base', inputPrice: 0.15, outputPrice: 0.6, currency: 'USD' },
  { id: 'gpt-4.1', model: 'GPT-4.1', encoding: 'o200k_base', inputPrice: 2.0, outputPrice: 8.0, currency: 'USD' },
  { id: 'gpt-4.1-mini', model: 'GPT-4.1 mini', encoding: 'o200k_base', inputPrice: 0.4, outputPrice: 1.6, currency: 'USD' },
  { id: 'o3', model: 'o3', encoding: 'o200k_base', inputPrice: 2.0, outputPrice: 8.0, currency: 'USD' },
  { id: 'o3-mini', model: 'o3-mini', encoding: 'o200k_base', inputPrice: 1.1, outputPrice: 4.4, currency: 'USD' },
  { id: 'gpt-4-turbo', model: 'GPT-4 Turbo', encoding: 'cl100k_base', inputPrice: 10.0, outputPrice: 30.0, currency: 'USD' },
  { id: 'gpt-3.5-turbo', model: 'GPT-3.5-Turbo', encoding: 'cl100k_base', inputPrice: 0.5, outputPrice: 1.5, currency: 'USD' },
  { id: 'claude-sonnet-4.5', model: 'Claude Sonnet 4.5', encoding: 'o200k_base', inputPrice: 3.0, outputPrice: 15.0, currency: 'USD' },
  { id: 'claude-opus-4.1', model: 'Claude Opus 4.1', encoding: 'o200k_base', inputPrice: 15.0, outputPrice: 75.0, currency: 'USD' },
  { id: 'claude-haiku-4.5', model: 'Claude Haiku 4.5', encoding: 'o200k_base', inputPrice: 1.0, outputPrice: 5.0, currency: 'USD' },
  { id: 'gemini-2.5-pro', model: 'Gemini 2.5 Pro', encoding: 'cl100k_base', inputPrice: 1.25, outputPrice: 10.0, currency: 'USD' },
  { id: 'gemini-2.5-flash', model: 'Gemini 2.5 Flash', encoding: 'cl100k_base', inputPrice: 0.3, outputPrice: 2.5, currency: 'USD' },
  { id: 'deepseek-v3.2', model: 'DeepSeek-V3.2', encoding: 'cl100k_base', inputPrice: 0.28, outputPrice: 0.42, currency: 'USD' },
];

// 停用词表（中英混合）
export const STOP_WORDS: Set<string> = new Set([
  // —— 中文常用虚词/助词/代词 ——
  '的', '了', '在', '是', '我', '和', '就', '都', '而', '及', '与', '或', '一个', '不', '也', '很', '到', '说', '要',
  '去', '会', '这', '那', '你', '他', '她', '它', '我们', '你们', '他们', '她们', '它们', '什么', '怎么', '已经',
  '可以', '没有', '这个', '那个', '自己', '之', '其', '为', '所', '被', '把', '让', '向', '对', '从', '跟', '给',
  '并', '但', '却', '因', '为', '如果', '因为', '所以', '然后', '但是', '而且', '或者', '虽然', '即使', '只要',
  '还有', '又', '再', '才', '就', '里', '中', '上', '下', '等', '看', '听', '吃', '想', '知道', '觉得', '认为',
  '起来', '出来', '过来', '下来', '一起', '一样', '这样', '那样', '这些', '那些', '这里', '那里', '哪儿', '哪儿',
  // —— 英文常用停用词 ——
  'a', 'an', 'the', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they',
  'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'ours', 'theirs', 'as', 'by', 'from', 'up', 'down',
  'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'don', 'do',
  'does', 'did', 'has', 'have', 'had', 'would', 'could', 'may', 'might', 'must', 'about', 'into', 'through',
]);

// token 预览时展示的最大 token 数量
export const TOKEN_PREVIEW_LIMIT = 100;
