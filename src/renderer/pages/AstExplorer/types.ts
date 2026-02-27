import React from 'react';

export interface Parser {
  id: string;
  displayName: string;
  version?: string;
  homepage?: string;
  showInMenu?: boolean;
  loadParser: (callback?: (parser: any) => void) => Promise<any>;
  parse: (parser: any, code: string, options?: any) => any;
  nodeToRange?: (node: any) => [number, number] | undefined;
  opensByDefault?: (node: any, key: string) => boolean;
  getNodeName?: (node: any) => string;
  forEachProperty?: (node: any) => Iterator<{ value: any; key: string; computed: boolean }>;
  renderSettings?: (settings: any, onChange: (settings: any) => void) => React.ReactNode;
  getDefaultOptions?: () => any;
  _ignoredProperties?: Set<string>;
  locationProps?: Set<string>;
  typeProps?: Set<string>;
  category?: Category;
}

export interface Transformer {
  id: string;
  displayName: string;
  version?: string;
  homepage?: string;
  defaultTransform: string;
  loadTransformer: (callback?: (transformer: any) => void) => Promise<any>;
  transform: (transformer: any, transformCode: string, code: string, options?: any) => any;
}

export interface Category {
  id: string;
  displayName: string;
  parsers: Parser[];
  transformers?: Transformer[];
}
