/**
 * gpt-tokenizer 子路径的 ambient 声明
 * 项目 tsconfig 为 moduleResolution: "node"，无法解析 exports 子路径，此处手动声明以消除 TS2307
 * 实际类型由 src/renderer/pages/TextAnalysis/utils/tokenize.ts 中的结构性接口 IEncodingModule 描述
 */
declare module 'gpt-tokenizer/encoding/o200k_base';
declare module 'gpt-tokenizer/encoding/cl100k_base';
declare module 'gpt-tokenizer/encoding/p50k_base';
declare module 'gpt-tokenizer/encoding/r50k_base';
