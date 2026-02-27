// 转换 RGB 到 CMYK
export const toCmyk = (rgb: any) => {
  const r = Math.max(0, Math.min(255, Number(rgb?.r ?? 0))) / 255;
  const g = Math.max(0, Math.min(255, Number(rgb?.g ?? 0))) / 255;
  const b = Math.max(0, Math.min(255, Number(rgb?.b ?? 0))) / 255;
  const k = 1 - Math.max(r, g, b);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 1 };
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return {
    c: Math.max(0, Math.min(1, isFinite(c) ? c : 0)),
    m: Math.max(0, Math.min(1, isFinite(m) ? m : 0)),
    y: Math.max(0, Math.min(1, isFinite(y) ? y : 0)),
    k: Math.max(0, Math.min(1, isFinite(k) ? k : 0)),
  };
};

// 转换 CMYK 到 RGB
export const cmykToRgb = (cmyk: any) => {
  const c = Math.max(0, Math.min(1, Number(cmyk?.c ?? 0)));
  const m = Math.max(0, Math.min(1, Number(cmyk?.m ?? 0)));
  const y = Math.max(0, Math.min(1, Number(cmyk?.y ?? 0)));
  const k = Math.max(0, Math.min(1, Number(cmyk?.k ?? 0)));
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: 1 };
};

// 计算 CMYK 颜色值
export const formatCmyk = (data: any) => {
  const c = Number(data.c ?? 0);
  const m = Number(data.m ?? 0);
  const y = Number(data.y ?? 0);
  const k = Number(data.k ?? 0);
  const c1 = Math.max(0, Math.min(1, c > 1 ? c / 100 : c));
  const m1 = Math.max(0, Math.min(1, m > 1 ? m / 100 : m));
  const y1 = Math.max(0, Math.min(1, y > 1 ? y / 100 : y));
  const k1 = Math.max(0, Math.min(1, k > 1 ? k / 100 : k));
  return { c: c1, m: m1, y: y1, k: k1 };
};
