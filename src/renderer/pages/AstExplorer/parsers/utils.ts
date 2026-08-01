export const defaultParserInterface = {
  id: '',
  displayName: '',
  version: '',
  homepage: '',
  showInMenu: true,
  _ignoredProperties: new Set<string>(),
  locationProps: new Set<string>(['range', 'loc', 'start', 'end']),
  typeProps: new Set<string>(['type']),

  opensByDefault(node: any, key: string) {
    return false;
  },

  nodeToRange(node: any): [number, number] | undefined {
    if (node.range) {
      return node.range;
    }
    if (typeof node.start === 'number' && typeof node.end === 'number') {
      return [node.start, node.end];
    }
    return undefined;
  },

  getNodeName(node: any) {
    if (node && typeof node.type === 'string') {
      return node.type;
    }
  },

  *forEachProperty(node: any) {
    if (node && typeof node === 'object') {
      for (let prop in node) {
        // @ts-ignore
        if (this._ignoredProperties.has(prop)) {
          continue;
        }
        yield {
          value: node[prop],
          key: prop,
          computed: false,
        };
      }
    }
  },

  getDefaultOptions() {
    return {};
  },

  _getSettingsConfiguration(defaultOptions: any) {
    const keys = Object.keys(defaultOptions);
    return keys.length > 0
      ? {
          fields: keys,
        }
      : null;
  },

  hasSettings() {
    // @ts-ignore
    return this._getSettingsConfiguration(this.getDefaultOptions()) != null;
  },
};

export const defaultESTreeParserInterface = {
  ...defaultParserInterface,
  opensByDefault(node: any, key: string) {
    return (
      (Boolean(node) && node.type === 'Program') ||
      key === 'body' ||
      key === 'elements' || // array literals
      key === 'declarations' || // variable declaration
      key === 'expression' // expression statements
    );
  },
};
