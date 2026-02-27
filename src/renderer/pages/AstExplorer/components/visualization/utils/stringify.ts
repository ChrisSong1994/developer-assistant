
/**
 * Converts a JS value to a sensible string representation.
 */
export default function stringify(value: any): string {
  switch (typeof value) {
    case 'function': {
      const match = value.toString().match(/function[^(]*\([^)]*\)/);
      return match ? match[0] : 'function';
    }
    case 'object':
      return value ? JSON.stringify(value, (k, v) => stringify(v)) : 'null';
    case 'undefined':
      return 'undefined';
    case 'number':
    case 'bigint':
      return Number.isNaN(value) ? 'NaN' : String(value);
    default:
      return JSON.stringify(value);
  }
}
