
// hex to base64
export function hexToBase64(v: string) {
  return Buffer.from(v, 'hex').toString('base64');
}

// hex to base64
export function Base64ToHex(v: string) {
  return Buffer.from(v, 'base64').toString('hex');
}
