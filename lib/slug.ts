/**
 * Converts a product/service name to a URL-friendly slug.
 * e.g. "A4 Paper Ream (500 sheets)" → "a4-paper-ream-500-sheets"
 */
export function toSlug(name: string): string {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/** True when value looks like a MongoDB ObjectId */
export function isObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value)
}
