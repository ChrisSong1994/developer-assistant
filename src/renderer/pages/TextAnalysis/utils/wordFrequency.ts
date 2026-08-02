/**
 * 词频分析：中英混合切词 + 高频词/高频汉字统计
 */
import { STOP_WORDS } from '../constants';
import { IFrequencyItem, IFrequencyParams, IFrequencyResult } from '../types';

/**
 * 中英混合切词：
 * - 英文/数字：按空白切分，去首尾非词字符后小写
 * - 中文：按连续汉字块匹配（/[一-龥]+/g）
 */
export function tokenizeWords(text: string): string[] {
  if (!text) return [];
  const words: string[] = [];
  // 英文/数字词
  const latin = text
    .split(/\s+/)
    .map((token) => token.replace(/^[^\w]+|[^\w]+$/g, ''))
    .filter((token) => token.length > 0)
    .map((token) => token.toLowerCase());
  words.push(...latin);
  // 中文连续汉字块
  const cjkMatches = text.match(/[一-鿿]+/g);
  if (cjkMatches) {
    words.push(...cjkMatches);
  }
  return words;
}

/**
 * 词频分析：
 * - words：英文词 + 中文汉字块合并，按 count 降序、count 相同按首次出现顺序
 * - hanzi：单个汉字计数，不过滤停用词
 */
export function analyzeFrequency(text: string, params: IFrequencyParams): IFrequencyResult {
  const { topN, minLength, filterStopWords } = params;

  // —— 高频词 ——
  const wordMap = new Map<string, number>();
  const firstIndex = new Map<string, number>();
  let index = 0;
  for (const word of tokenizeWords(text)) {
    // 最小词长过滤（英文按字母数，中文按汉字块长度）
    if (word.length < minLength) continue;
    // 停用词过滤
    if (filterStopWords && STOP_WORDS.has(word)) continue;
    if (!firstIndex.has(word)) firstIndex.set(word, index);
    wordMap.set(word, (wordMap.get(word) || 0) + 1);
    index++;
  }
  const words: IFrequencyItem[] = Array.from(wordMap.entries())
    .map(([text, count]) => ({ text, count, first: firstIndex.get(text)! }))
    .sort((a, b) => b.count - a.count || a.first - b.first)
    .slice(0, topN)
    .map(({ text, count }) => ({ text, count }));

  // —— 高频汉字 ——
  const hanziMap = new Map<string, number>();
  const cjkChars = text.match(/[一-鿿]/g);
  if (cjkChars) {
    cjkChars.forEach((char) => {
      hanziMap.set(char, (hanziMap.get(char) || 0) + 1);
    });
  }
  const hanzi: IFrequencyItem[] = Array.from(hanziMap.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);

  return { words, hanzi };
}
