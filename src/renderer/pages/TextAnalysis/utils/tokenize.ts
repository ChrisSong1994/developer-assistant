/**
 * gpt-tokenizer 封装：懒加载 + 编码实例缓存 + 计数 API
 * - 首屏不加载词表，首次计数时才动态 import 对应编码 chunk
 * - 统一传 { disallowedSpecial: new Set() }，避免文本含 <|...|> 特殊 token 时抛错
 */
import { ALL_ENCODINGS, TOKEN_PREVIEW_LIMIT } from '../constants';
import { TEncodingName } from '../types';

// 库返回模块的结构性类型（避免依赖 gpt-tokenizer 的类型解析）
export interface IEncodingModule {
  encode: (text: string, opts?: Record<string, unknown>) => number[];
  countTokens: (text: string, opts?: Record<string, unknown>) => number;
  decode: (tokens: Iterable<number>) => string;
}

// 编码 → 懒加载器
const encodingLoaders: Record<TEncodingName, () => Promise<IEncodingModule>> = {
  o200k_base: () => import('gpt-tokenizer/encoding/o200k_base'),
  cl100k_base: () => import('gpt-tokenizer/encoding/cl100k_base'),
  p50k_base: () => import('gpt-tokenizer/encoding/p50k_base'),
  r50k_base: () => import('gpt-tokenizer/encoding/r50k_base'),
};

// 编码实例缓存：缓存 Promise，天然防并发重复加载
const encodingCache = new Map<TEncodingName, Promise<IEncodingModule>>();

// 统一 encode 选项：特殊 token 按普通文本 BPE 编码，不抛错
const ENCODE_OPTIONS = { disallowedSpecial: new Set() };

/** 获取（或首次加载）编码实例 */
export function getEncoding(name: TEncodingName): Promise<IEncodingModule> {
  let cached = encodingCache.get(name);
  if (!cached) {
    cached = encodingLoaders[name]();
    encodingCache.set(name, cached);
  }
  return cached;
}

/** 按编码计算 token 数（不保留 token 数组，内存友好） */
export async function countTokens(text: string, encoding: TEncodingName): Promise<number> {
  const module = await getEncoding(encoding);
  return module.countTokens(text, ENCODE_OPTIONS);
}

/** 完整 tokenize，返回 token id 数组 */
export async function tokenize(text: string, encoding: TEncodingName): Promise<number[]> {
  const module = await getEncoding(encoding);
  return module.encode(text, ENCODE_OPTIONS);
}

export interface ITokenDetail {
  id: number;
  text: string;
}

export interface ITokenizeResult {
  total: number; // token 总数
  details: ITokenDetail[]; // 前 limit 个 token 明细（含解码文本）
}

/** tokenize + 解码明细：一次调用同时拿到总数和预览（limit 个） */
export async function tokenizeWithDetails(
  text: string,
  encoding: TEncodingName,
  limit: number = TOKEN_PREVIEW_LIMIT,
): Promise<ITokenizeResult> {
  const module = await getEncoding(encoding);
  const allTokens = module.encode(text, ENCODE_OPTIONS);
  const details = allTokens.slice(0, limit).map((id) => ({ id, text: module.decode([id]) }));
  return { total: allTokens.length, details };
}

/**
 * token 长度分布（按解码后字符长度分桶）
 * 大文本只分析前 maxTokens 个 token，避免解码开销过大
 */
export async function tokenLengthDistribution(
  text: string,
  encoding: TEncodingName,
  maxTokens = 10000,
): Promise<Array<{ label: string; value: number }>> {
  const module = await getEncoding(encoding);
  const allTokens = module.encode(text, ENCODE_OPTIONS);
  const analyzed = allTokens.slice(0, maxTokens);
  const buckets = new Map<string, number>();
  for (const id of analyzed) {
    const len = module.decode([id]).length;
    const label = len <= 10 ? String(len) : len <= 20 ? '11-20' : len <= 50 ? '21-50' : len <= 100 ? '51-100' : '100+';
    buckets.set(label, (buckets.get(label) || 0) + 1);
  }
  return Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
}

/** 批量计数：一次算出多个编码的 token 数（并行） */
export async function batchCountTokens(
  text: string,
  encodings: TEncodingName[] = ALL_ENCODINGS,
): Promise<Partial<Record<TEncodingName, number>>> {
  const results = await Promise.all(
    encodings.map(async (encoding) => {
      const count = await countTokens(text, encoding);
      return { encoding, count };
    }),
  );
  const map: Partial<Record<TEncodingName, number>> = {};
  results.forEach(({ encoding, count }) => {
    map[encoding] = count;
  });
  return map;
}

/** 按模型名计算 token 数（模型 → 编码映射） */
export async function countTokensByModel(text: string, model: string): Promise<number> {
  const encoding = MODEL_ENCODING_MAP[model] || 'o200k_base';
  return countTokens(text, encoding);
}

// 常见模型 → 编码映射（与 constants.ENCODING_MODEL_OPTIONS 对应）
const MODEL_ENCODING_MAP: Record<string, TEncodingName> = {
  'gpt-4o': 'o200k_base',
  'gpt-4o-mini': 'o200k_base',
  'gpt-4.1': 'o200k_base',
  'gpt-4.1-mini': 'o200k_base',
  'gpt-5': 'o200k_base',
  o1: 'o200k_base',
  o3: 'o200k_base',
  'gpt-4': 'cl100k_base',
  'gpt-3.5-turbo': 'cl100k_base',
  'text-davinci-003': 'p50k_base',
  'code-davinci-002': 'p50k_base',
  'text-davinci-002': 'p50k_base',
  'text-davinci-001': 'r50k_base',
  'gpt-2': 'r50k_base',
};
