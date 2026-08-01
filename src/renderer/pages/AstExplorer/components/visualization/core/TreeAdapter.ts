
export interface Filter {
  key: string;
  label: string;
  test: (value: any, key: string, fromArray: boolean) => boolean;
}

export interface AdapterOptions {
  filters?: Filter[];
  nodeToRange?: (node: any) => [number, number] | null;
  nodeToName?: (node: any) => string;
  walkNode?: (node: any) => IterableIterator<{ key: string; value: any; computed?: boolean }>;
  openByDefault?: (node: any, key: string) => boolean;
  locationProps?: Set<string>;
}

export class TreeAdapter {
  private _ranges = new WeakMap<object, [number, number] | null>();
  private _filterValues: Record<string, boolean>;
  private _adapterOptions: AdapterOptions;

  constructor(adapterOptions: AdapterOptions, filterValues: Record<string, boolean>) {
    this._filterValues = filterValues;
    this._adapterOptions = adapterOptions;
  }

  getConfigurableFilters() {
    return (this._adapterOptions.filters || []).filter(filter => Boolean(filter.key));
  }

  getNodeName(node: any) {
    return this._adapterOptions.nodeToName?.(node);
  }

  getRange(node: any): [number, number] | null {
    if (node == null) {
      return null;
    }
    if (typeof node === 'object' && this._ranges.has(node)) {
      return this._ranges.get(node)!;
    }
    const { nodeToRange } = this._adapterOptions;
    if (!nodeToRange) return null;
    
    let range = nodeToRange(node);
    if (node && typeof node === 'object') {
      this._ranges.set(node, range);
    }
    return range;
  }

  isInRange(node: any, key: string, position: number): boolean {
    if (this.isLocationProp(key)) {
      return false;
    }
    if (!Number.isInteger(position)) {
      return false;
    }
    const range = this.getRange(node);
    if (!range) {
      return false;
    }
    return range[0] <= position && position <= range[1];
  }

  hasChildrenInRange(node: any, key: string, position: number, seen = new Set<any>()): boolean {
    if (this.isLocationProp(key)) {
      return false;
    }
    if (!Number.isInteger(position)) {
      return false;
    }
    seen.add(node);
    const range = this.getRange(node);
    if (range && !this.isInRange(node, key, position)) {
      return false;
    }
    
    for (const { value: child, key: childKey } of this.walkNode(node)) {
      if (this.isInRange(child, childKey, position)) {
        return true;
      }
    }
    for (const { value: child, key: childKey } of this.walkNode(node)) {
      if (seen.has(child)) {
        continue;
      }
      if (this.hasChildrenInRange(child, childKey, position, seen)) {
        return true;
      }
    }
    return false;
  }

  isLocationProp(key: string): boolean {
    return !!(this._adapterOptions.locationProps && this._adapterOptions.locationProps.has(key));
  }

  opensByDefault(node: any, key: string): boolean {
    return !!this._adapterOptions.openByDefault?.(node, key);
  }

  isArray(node: any): boolean {
    return Array.isArray(node);
  }

  isObject(node: any): boolean {
    return Boolean(node) && typeof node === 'object' && !this.isArray(node);
  }

  *walkNode(node: any): IterableIterator<{ key: string; value: any; computed?: boolean }> {
    if (node != null && this._adapterOptions.walkNode) {
      for (const result of this._adapterOptions.walkNode(node)) {
        if (
          (this._adapterOptions.filters || []).some(filter => {
            if (filter.key && !this._filterValues[filter.key]) {
              return false;
            }
            return filter.test(result.value, result.key, Array.isArray(node));
          })
        ) {
          continue;
        }
        yield result;
      }
    }
  }
}

export function ignoreKeysFilter(keys = new Set<string>(), key: string, label: string): Filter {
  return {
    key,
    label,
    test: (_, k) => keys.has(k),
  };
}

export function locationInformationFilter(keys: Set<string>): Filter {
  return ignoreKeysFilter(
    keys,
    'hideLocationData',
    'Hide location data',
  );
}

export function functionFilter(): Filter {
  return {
    key: 'hideFunctions',
    label: 'Hide methods',
    test: (value) => typeof value === 'function',
  };
}

export function emptyKeysFilter(): Filter {
  return {
    key: 'hideEmptyKeys',
    label: 'Hide empty keys',
    test: (value, _, fromArray) => value == null && !fromArray,
  };
}

export function typeKeysFilter(keys?: Set<string>): Filter {
  return ignoreKeysFilter(
    keys,
    'hideTypeKeys',
    'Hide type keys',
  );
}

const TreeAdapterConfigs: Record<string, any> = {
  default: {
    filters: [],
    openByDefault: () => false,
    nodeToRange: () => null,
    nodeToName: () => { throw new Error('nodeToName must be passed'); },
    walkNode: () => { throw new Error('walkNode must be passed'); },
  },

  estree: {
    filters: [
      functionFilter(),
      emptyKeysFilter(),
      locationInformationFilter(new Set(['range', 'loc', 'start', 'end'])),
      typeKeysFilter(new Set(['type'])),
    ],
    openByDefault(node: any, key: string) {
        const openByDefaultNodes = new Set(['Program']);
        const openByDefaultKeys = new Set([
          'body',
          'elements', // array literals
          'declarations', // variable declaration
          'expression', // expression statements
        ]);
        return (node && openByDefaultNodes.has(node.type)) ||
        openByDefaultKeys.has(key);
    },
    nodeToRange(node: any) {
      if (!(node && typeof node === 'object')) {
        return null;
      }
      if (node.range) {
        return node.range;
      }
      if (typeof node.start === 'number' && typeof node.end === 'number') {
        return [node.start, node.end];
      }
      return null;
    },
    nodeToName(node: any) {
      return node.type;
    },
    *walkNode(node: any) {
      if (node && typeof node === 'object') {
        for (let prop in node) {
          yield {
            value: node[prop],
            key: prop,
            computed: false,
          }
        }
      }
    },
  },

  json: {
    filters: [],
    openByDefault: () => false,
    nodeToRange: () => null,
    nodeToName: (node: any) => node && typeof node === 'object' && !Array.isArray(node) ? (node.type || node.kind || 'Object') : null,
    *walkNode(node: any) {
      if (node && typeof node === 'object') {
        for (let prop in node) {
          yield {
            value: node[prop],
            key: prop,
            computed: false,
          }
        }
      }
    },
  },
};

export function treeAdapterFromParseResult(parseResult: any, filterValues: Record<string, boolean>) {
  const { treeAdapter } = parseResult;
  const config = TreeAdapterConfigs[treeAdapter.type];
  if (!config) {
    throw new Error(`Unknown tree adapter type "${treeAdapter.type}"`);
  }
  return new TreeAdapter(
    { ...config, ...treeAdapter.options },
    filterValues,
  );
}
