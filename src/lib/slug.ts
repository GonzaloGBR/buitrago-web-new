const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && slug.length >= 2 && slug.length <= 80;
}

export function isValidProductId(id: string): boolean {
  return /^[a-z0-9-]+$/.test(id) && id.length >= 2 && id.length <= 80;
}
