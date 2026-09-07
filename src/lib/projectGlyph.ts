/** 从 slug 生成 CRT 字形标记，如 watermark-video → WV */
export function projectGlyph(slug: string): string {
  const parts = slug.split('-').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
  }
  return slug.slice(0, 2).toUpperCase();
}
