/**
 * 文本统计：字符/词/行/段/句/字节/熵/阅读时长 + hash 指纹
 */
import { READING_SPEED } from '../constants';
import Events from '@/renderer/utils/events';
import { ITextStats } from '../types';
import { tokenizeWords } from './wordFrequency';

// 中文标点 + 英文标点
const PUNCTUATION_RE =
  /[，。！？；：""''（）《》〈〉【】「」『』、…—·～,.;:!?'"\-()\[\]{}<>\/\\|`~@#$%^&*+=_]/;

/**
 * 同步计算除指纹外的全部统计字段
 */
export function computeStats(text: string): Omit<ITextStats, 'md5' | 'sha1' | 'sha256'> {
  if (!text) {
    return {
      charCount: 0,
      charCountNoSpace: 0,
      cjkCount: 0,
      letterCount: 0,
      digitCount: 0,
      punctuationCount: 0,
      whitespaceCount: 0,
      latinWordCount: 0,
      cjkBlockCount: 0,
      wordCount: 0,
      uniqueWordCount: 0,
      lineCount: 0,
      paragraphCount: 0,
      sentenceCount: 0,
      utf8Bytes: 0,
      entropy: 0,
      readMinutes: 0,
      readSeconds: 0,
    };
  }

  // —— 字符统计（按 Unicode 码点遍历，避免 [...text] 大文本 OOM）——
  let charCount = 0;
  let charCountNoSpace = 0;
  let cjkCount = 0;
  let letterCount = 0;
  let digitCount = 0;
  let punctuationCount = 0;
  let whitespaceCount = 0;
  const freq = new Map<string, number>();
  for (const ch of text) {
    charCount++;
    if (/\s/.test(ch)) {
      whitespaceCount++;
    } else {
      charCountNoSpace++;
    }
    if (/[一-鿿]/.test(ch)) cjkCount++;
    if (/[A-Za-z]/.test(ch)) letterCount++;
    if (/\d/.test(ch)) digitCount++;
    if (PUNCTUATION_RE.test(ch)) punctuationCount++;
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  // —— 词 / 行 / 段 / 句 ——
  const words = tokenizeWords(text);
  const uniqueWordCount = new Set(words).size;
  const cjkBlockCount = (text.match(/[一-鿿]+/g) || []).length;
  const latinWordCount = words.length - cjkBlockCount;
  const lineCount = text.split(/\r\n|\r|\n/).length;
  const paragraphCount = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const sentenceCount = (text.match(/[.!?。！？]+(?:\s|$)/g) || []).length;

  // —— 字节 / 熵 / 阅读 ——
  const utf8Bytes = Buffer.byteLength(text, 'utf-8');
  // Shannon 信息熵：H = -Σ p·log2(p)，空文本为 0
  let entropy = 0;
  for (const count of freq.values()) {
    const p = count / charCount;
    entropy -= p * Math.log2(p);
  }
  const readSeconds =
    (cjkCount / READING_SPEED.cjkCharsPerMinute) * 60 +
    (latinWordCount / READING_SPEED.latinWordsPerMinute) * 60;
  const readMinutes = readSeconds / 60;

  return {
    charCount,
    charCountNoSpace,
    cjkCount,
    letterCount,
    digitCount,
    punctuationCount,
    whitespaceCount,
    latinWordCount,
    cjkBlockCount,
    wordCount: words.length,
    uniqueWordCount,
    lineCount,
    paragraphCount,
    sentenceCount,
    utf8Bytes,
    entropy,
    readMinutes,
    readSeconds,
  };
}

/**
 * 通过主进程 IPC 计算指纹（复用 Events.createHash，无需改动主进程）
 */
export async function computeFingerprints(
  text: string,
): Promise<Pick<ITextStats, 'md5' | 'sha1' | 'sha256'>> {
  const [md5, sha1, sha256] = await Promise.all([
    Events.createHash({ hash: 'MD5', content: text }),
    Events.createHash({ hash: 'SHA1', content: text }),
    Events.createHash({ hash: 'SHA256', content: text }),
  ]);
  return { md5, sha1, sha256 };
}
