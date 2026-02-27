
import React from 'react';

export type Range = [number, number];

export interface Parser<P = any, O = any> {
  id: string;
  displayName: string; // label
  version?: string;
  homepage?: string; // link
  showInMenu?: boolean;
  loadParser: (callback?: (parser: P) => void) => Promise<P>;
  parse: (parser: P, code: string, options?: O) => any;
  nodeToRange?: (node: any) => Range | undefined;
  opensByDefault?: (node: any, key: string) => boolean;
  getNodeName?: (node: any) => string;
  forEachProperty?: (node: any) => Iterator<{ value: any; key: string; computed: boolean }>;
  renderSettings?: (settings: any, onChange: (settings: any) => void) => React.ReactNode;
  getDefaultOptions?: () => O;
  _ignoredProperties?: Set<string>;
  locationProps?: Set<string>;
  typeProps?: Set<string>;
  category?: Category;
  editorLanguage?: string;
}

export interface Transformer<T = any> {
  id: string;
  displayName: string;
  version?: string;
  homepage?: string;
  defaultTransform: string;
  loadTransformer: (callback?: (transformer: T) => void) => Promise<T>;
  transform: (transformer: T, transformCode: string, code: string, options?: any) => any;
}

export interface Category {
  id: string;
  displayName: string;
  parsers: Parser[];
  transformers?: Transformer[];
  codeExample?: string;
}
