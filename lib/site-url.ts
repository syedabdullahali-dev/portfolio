/**
 * The canonical URL of the deployed site.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL          — set this when you buy a real domain
 *   2. CANONICAL                     — the domain you actually chose
 *   3. VERCEL_PROJECT_PRODUCTION_URL — whatever Vercel generated
 *   4. localhost                     — local development
 *
 * CANONICAL sits above Vercel's own value on purpose. Vercel bakes its
 * generated hostname in at build time, so renaming the domain later leaves
 * the sitemap, robots.txt and share-card URL pointing at the dead name until
 * something triggers a rebuild. Pinning the chosen domain means those stay
 * correct no matter what the deployment happens to be called.
 */
const CANONICAL = 'https://syedabdullahali.vercel.app';

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  if (CANONICAL) return CANONICAL;

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return 'http://localhost:3000';
}

export const SITE_URL = getSiteUrl();
