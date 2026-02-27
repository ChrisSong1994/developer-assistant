
import { create } from 'zustand';
import { Category, Parser, Transformer } from '../types';
import { getDefaultCategory, getDefaultParser } from '../parsers';

interface AstExplorerState {
  category: Category;
  parser: Parser;
  transformer: Transformer | undefined;
  code: string;
  ast: any;
  transformCode: string;
  transformedCode: string;
  transformEnabled: boolean;
  viewType: 'tree' | 'json';
  loading: boolean;
  error: string | null;
  transformError: string | null;

  setCategory: (category: Category) => void;
  setParser: (parser: Parser) => void;
  setTransformer: (transformer: Transformer | undefined) => void;
  setCode: (code: string) => void;
  setAst: (ast: any) => void;
  setTransformCode: (code: string) => void;
  setTransformedCode: (code: string) => void;
  setTransformEnabled: (enabled: boolean) => void;
  setViewType: (type: 'tree' | 'json') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTransformError: (error: string | null) => void;
}

export const useAstExplorerStore = create<AstExplorerState>((set) => ({
  category: getDefaultCategory(),
  parser: getDefaultParser(),
  transformer: undefined,
  code: getDefaultCategory().codeExample?.trim() || '// Type code here...',
  ast: null,
  transformCode: '',
  transformedCode: '',
  transformEnabled: false,
  viewType: 'tree',
  loading: false,
  error: null,
  transformError: null,

  setCategory: (category) => set({ category }),
  setParser: (parser) => set({ parser }),
  setTransformer: (transformer) => set({ transformer }),
  setCode: (code) => set({ code }),
  setAst: (ast) => set({ ast }),
  setTransformCode: (transformCode) => set({ transformCode }),
  setTransformedCode: (transformedCode) => set({ transformedCode }),
  setTransformEnabled: (transformEnabled) => set({ transformEnabled }),
  setViewType: (viewType) => set({ viewType }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setTransformError: (transformError) => set({ transformError }),
}));
