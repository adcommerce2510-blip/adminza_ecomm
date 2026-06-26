/**
 * Converts a product/service name to a URL-friendly slug.
 * e.g. "A4 Paper Ream (500 sheets)" → "a4-paper-ream-500-sheets"
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
}
