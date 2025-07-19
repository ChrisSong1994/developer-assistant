// code from 豆包
// @ts-nocheck
type GoType =
  | 'string'
  | 'int'
  | 'int64'
  | 'float64'
  | 'bool'
  | 'interface{}'
  | StructType
  | ArrayType
  | MapType;

interface StructType {
  type: 'struct';
  fields: Field[];
}

interface ArrayType {
  type: 'array';
  elementType: GoType;
}

interface MapType {
  type: 'map';
  keyType: 'string';
  valueType: GoType;
}

interface Field {
  name: string;
  originalName: string;
  type: GoType;
  tags?: string[];
}

interface Options {
  rootStructName?: string;
  snakeCaseFields?: boolean;
  addJSONTags?: boolean;
  addXMLTags?: boolean;
  addYAMLTags?: boolean;
  usePointersForOptionalFields?: boolean;
  useCustomTypeMap?: Record<string, string>;
}

export function jsonToGoStruct(jsonString: string, options: Options = {}): string {
  const {
    rootStructName = 'Root',
    snakeCaseFields = true,
    addJSONTags = true,
    addXMLTags = false,
    addYAMLTags = false,
    usePointersForOptionalFields = true,
    useCustomTypeMap = {},
  } = options;

  try {
    const jsonData = JSON.parse(jsonString);
    const structType = inferType(jsonData, useCustomTypeMap) as StructType;
    return generateGoCode(structType, rootStructName, {
      snakeCaseFields,
      addJSONTags,
      addXMLTags,
      addYAMLTags,
      usePointersForOptionalFields,
    });
  } catch (error) {
    console.error('Error converting JSON to Go struct:', error);
    throw error;
  }
}

function inferType(data: any, customTypeMap: Record<string, string>): GoType {
  if (data === null || data === undefined) {
    return 'interface{}';
  }

  const type = typeof data;

  switch (type) {
    case 'string':
      return 'string';
    case 'number':
      return Number.isInteger(data) ? 'int' : 'float64';
    case 'boolean':
      return 'bool';
    case 'object':
      if (Array.isArray(data)) {
        return inferArrayType(data, customTypeMap);
      } else {
        return inferStructType(data, customTypeMap);
      }
    default:
      return 'interface{}';
  }
}

function inferArrayType(arr: any[], customTypeMap: Record<string, string>): ArrayType {
  if (arr.length === 0) {
    return { type: 'array', elementType: 'interface{}' };
  }

  const elementTypes = arr.map(item => inferType(item, customTypeMap));
  const commonType = findCommonType(elementTypes);

  return { type: 'array', elementType: commonType };
}

function findCommonType(types: GoType[]): GoType {
  if (types.length === 0) {
    return 'interface{}';
  }

  let commonType = types[0];

  for (let i = 1; i < types.length; i++) {
    commonType = mergeTypes(commonType, types[i]);
  }

  return commonType;
}

function mergeTypes(type1: GoType, type2: GoType): GoType {
  if (type1 === type2) {
    return type1;
  }

  // Handle basic types
  const basicTypes: Record<string, number> = {
    'interface{}': 0,
    'string': 1,
    'bool': 2,
    'float64': 3,
    'int': 4,
  };

  if (typeof type1 === 'string' && typeof type2 === 'string') {
    return basicTypes[type1] < basicTypes[type2] ? type1 : type2;
  }

  // Handle structs
  if (type1.type === 'struct' && type2.type === 'struct') {
    const mergedFields: Field[] = [];
    const allFieldNames = new Set([
      ...type1.fields.map(f => f.originalName),
      ...type2.fields.map(f => f.originalName),
    ]);

    allFieldNames.forEach(fieldName => {
      const field1 = type1.fields.find(f => f.originalName === fieldName);
      const field2 = type2.fields.find(f => f.originalName === fieldName);

      if (field1 && field2) {
        mergedFields.push({
          ...field1,
          type: mergeTypes(field1.type, field2.type),
        });
      } else if (field1) {
        mergedFields.push(field1);
      } else if (field2) {
        mergedFields.push(field2);
      }
    });

    return { type: 'struct', fields: mergedFields };
  }

  // Handle arrays
  if (type1.type === 'array' && type2.type === 'array') {
    return {
      type: 'array',
      elementType: mergeTypes(type1.elementType, type2.elementType),
    };
  }

  // Handle maps
  if (type1.type === 'map' && type2.type === 'map') {
    return {
      type: 'map',
      keyType: 'string',
      valueType: mergeTypes(type1.valueType, type2.valueType),
    };
  }

  return 'interface{}';
}

function inferStructType(obj: Record<string, any>, customTypeMap: Record<string, string>): StructType {
  const fields: Field[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fieldType = inferType(value, customTypeMap);
    const fieldName = toCamelCase(key);

    fields.push({
      name: fieldName,
      originalName: key,
      type: fieldType,
    });
  }

  return { type: 'struct', fields };
}

function generateGoCode(structType: StructType, structName: string, options: {
  snakeCaseFields: boolean;
  addJSONTags: boolean;
  addXMLTags: boolean;
  addYAMLTags: boolean;
  usePointersForOptionalFields: boolean;
}): string {
  let code = `type ${structName} struct {\n`;

  structType.fields.forEach(field => {
    const fieldName = options.snakeCaseFields ? toSnakeCase(field.name) : field.name;
    const fieldType = renderGoType(field.type, options.usePointersForOptionalFields);
    const tags = generateTags(field.originalName, options);

    code += `  ${capitalizeFirstLetter(fieldName)} ${fieldType} ${tags}\n`;
  });

  code += '}\n\n';

  // Generate nested structs
  structType.fields.forEach(field => {
    if (field.type.type === 'struct') {
      const nestedStructName = capitalizeFirstLetter(field.name) + 'Struct';
      code += generateGoCode(field.type, nestedStructName, options);
    }
  });

  return code.trim();
}

function renderGoType(goType: GoType, usePointers: boolean): string {
  if (typeof goType === 'string') {
    return goType;
  }

  switch (goType.type) {
    case 'struct':
      return 'struct {\n' + goType.fields.map(field => {
        const fieldType = renderGoType(field.type, usePointers);
        const fieldName = capitalizeFirstLetter(field.name);
        return `  ${fieldName} ${fieldType}`;
      }).join('\n') + '\n}';
    case 'array':
      const elementType = renderGoType(goType.elementType, usePointers);
      return `[]${elementType}`;
    case 'map':
      const valueType = renderGoType(goType.valueType, usePointers);
      return `map[string]${valueType}`;
    default:
      return 'interface{}';
  }
}

function generateTags(fieldName: string, options: {
  addJSONTags: boolean;
  addXMLTags: boolean;
  addYAMLTags: boolean;
}): string {
  const tags: string[] = [];

  if (options.addJSONTags) {
    tags.push(`json:"${fieldName}"`);
  }

  if (options.addXMLTags) {
    tags.push(`xml:"${fieldName}"`);
  }

  if (options.addYAMLTags) {
    tags.push(`yaml:"${fieldName}"`);
  }

  return tags.length > 0 ? '`' + tags.join(' ') + '`' : '';
}

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, m => m.toLowerCase());
}

function toSnakeCase(str: string): string {
  return str
    .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    .replace(/^_/, '');
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}    