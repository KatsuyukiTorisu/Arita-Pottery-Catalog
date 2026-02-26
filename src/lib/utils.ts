/**
 * Generates a unique membership ID for new members.
 * Format: ART-<timestamp36>-<random4>
 */
export function generateMembershipId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ART-${ts}-${rand}`;
}

/**
 * Converts a string to a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a cryptographically secure random token.
 */
export function generateToken(length = 32): string {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Formats a price in JPY.
 */
export function formatPrice(price: number | null | undefined, locale = 'ja-JP'): string {
  if (price == null) return '—';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'JPY' }).format(price);
}
