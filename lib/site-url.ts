/**
 * The canonical URL of the deployed site.
 *
 * Hardcoding a guessed domain means the share card, sitemap and robots.txt all
 * point somewhere that may not be yours. This resolves it instead:
 *
 *   1. NEXT_PUBLIC_SITE_URL          — set this once you have a custom domain
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel sets this automatically
 *   3. localhost                     — local development
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return 'http://localhost:3000';
}

export const SITE_URL = getSiteUrl();
