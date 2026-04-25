export function getCategoryColorHex(index: number, total: number): string {
  const hue = (index / total) * 360;
  const s = 70, l = 52;
  const a = s * Math.min(l, 100 - l) / 100;
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color / 100).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generateCategoryColorsMap(categories: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  categories.forEach((cat, i) => {
    map[cat] = getCategoryColorHex(i, categories.length);
  });
  return map;
}
