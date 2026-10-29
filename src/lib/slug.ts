/** Convert a display name into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/** Ensure slug is unique within an existing list (appends -2, -3, …). */
export function uniqueSlug(base: string, existing: string[], excludeSlug?: string): string {
  const cleaned = slugify(base) || 'category';
  const taken = new Set(existing.filter((s) => s !== excludeSlug));
  if (!taken.has(cleaned)) return cleaned;
  let n = 2;
  while (taken.has(`${cleaned}-${n}`)) n += 1;
  return `${cleaned}-${n}`;
}
