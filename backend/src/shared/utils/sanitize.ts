// =============================================================================
// Input Sanitization Utilities
// Prevents XSS and injection attacks
// =============================================================================

/** Strips HTML tags from a string to prevent XSS */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/** Escapes HTML special characters */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/** Sanitizes a string: trims, strips HTML, limits length */
export function sanitizeString(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';
  return stripHtml(input).substring(0, maxLength).trim();
}

/** Sanitizes an email address */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().substring(0, 254);
}

/** Removes null bytes and control characters */
export function removeControlChars(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/** Sanitizes a filename to prevent path traversal */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
}
