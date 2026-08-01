
import { Parser } from '../../types';

export const nodeLocationFields = {
  startEnd: {
    type: ['type'],
    start: ['start'],
    end: ['end'],
  },
  swc: {
    type: ['type'],
    start: ['span', 'start'],
    end: ['span', 'end'],
  },
  range: {
    type: ['type'],
    start: ['range', 0],
    end: ['range', 1],
  },
  locOffset: {
    type: ['type'],
    start: ['loc', 'start', 'offset'],
    end: ['loc', 'end', 'offset'],
  },
  htmlparser2: {
    type: ['type'],
    start: ['startIndex'],
    end: ['endIndex'],
  },
  angularCompilerAst: {
    type: ['constructor', 'name'],
    start: ['sourceSpan', 'start'],
    end: ['sourceSpan', 'end'],
  },
  angularCompilerTmpl: {
    type: ['constructor', 'name'],
    start: ['sourceSpan', 'start', 'offset'],
    end: ['sourceSpan', 'end', 'offset'],
  },
  positionOffset: {
    type: ['type'],
    start: ['position', 'start', 'offset'],
    end: ['position', 'end', 'offset'],
  },
  postcss: {
    type: ['type'],
    start: ['source', 'start', 'offset'],
    end: ['source', 'end', 'offset'],
  },
  jinxRust: {
    type: ['type'],
    start: ['loc', '0'],
    end: ['loc', '1'],
  },
  php: {
    type: ['kind'],
    start: ['loc', 'start', 'offset'],
    end: ['loc', 'end', 'offset'],
  },
  ultrahtml: {
    type: ['type'],
    start: ['loc', '0', 'start'],
    end: ['loc', '1', 'end'],
  },
  graphql: {
    type: ['kind'],
    start: ['loc', 'start'],
    end: ['loc', 'end'],
  },
  angularHtmlParser: {
    type: ['kind'],
    start: ['sourceSpan', 'start', 'offset'],
    end: ['sourceSpan', 'end', 'offset'],
  },
  java: {
    type: ['name'],
    start: ['location', 'startOffset'],
    end: ['location', 'endOffset'],
  },
  treeSitter: {
    type: ['type'],
    start: ['startIndex'],
    end: ['endIndex'],
  },
} as const;

export function getValue(object: any, path: Readonly<(string | number)[]>) {
  let current: any = object;
  for (const sub of path) {
    if (!current) return;
    current = current[sub];
  }
  return current;
}

export function genGetNodeLocation(
  preset: keyof typeof nodeLocationFields,
): NonNullable<Parser['nodeToRange']> {
  return (node: any) => {
    if (typeof node !== 'object') return;

    // For now we ignore the 'ast' param logic from original code as nodeToRange usually handles AST nodes
    // The original code handled mapping between JSON view and Code view. 
    // Here we just map AST node to range.

    const type = getValue(node, nodeLocationFields[preset].type as any);
    if (!type) return;

    const start = getValue(node, nodeLocationFields[preset].start as any);
    const end = getValue(node, nodeLocationFields[preset].end as any);
    
    if (typeof start !== 'number' || typeof end !== 'number') return;

    return [start, end];
  };
}

export const getNodeLocation = genGetNodeLocation('startEnd');
