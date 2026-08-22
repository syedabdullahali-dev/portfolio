import { ICON_PATHS } from './icon-paths';

export type StackItem = {
  name: string;
  /** Tools link out; languages don't. */
  href?: string;
  /** simple-icons key from data/icon-paths.ts */
  icon?: keyof typeof ICON_PATHS | string;
  /** Adobe/Canva marks aren't in simple-icons — draw their monogram tile instead. */
  monogram?: string;
  /** Override colour (used for monograms and for marks whose brand colour is near-black). */
  hex?: string;
  kind: 'tool' | 'language';
};

// ─────────────────────────────────────────────────────────────
//  Edit this list to match what you actually use. Anything with
//  an `href` becomes a link; languages deliberately have none.
// ─────────────────────────────────────────────────────────────

export const stack: StackItem[] = [
  // ── Design & video ──
  { name: 'Photoshop', monogram: 'Ps', hex: '#31A8FF', href: 'https://www.adobe.com/products/photoshop.html', kind: 'tool' },
  { name: 'Illustrator', monogram: 'Ai', hex: '#FF9A00', href: 'https://www.adobe.com/products/illustrator.html', kind: 'tool' },
  { name: 'Premiere Pro', monogram: 'Pr', hex: '#9999FF', href: 'https://www.adobe.com/products/premiere.html', kind: 'tool' },
  { name: 'After Effects', monogram: 'Ae', hex: '#9999FF', href: 'https://www.adobe.com/products/aftereffects.html', kind: 'tool' },
  { name: 'DaVinci Resolve', icon: 'DaVinci Resolve', hex: '#B7C7D8', href: 'https://www.blackmagicdesign.com/products/davinciresolve', kind: 'tool' },
  { name: 'CapCut Pro', monogram: 'Cc', hex: '#F4EADF', href: 'https://www.capcut.com', kind: 'tool' },
  { name: 'Canva', monogram: 'C', hex: '#00C4CC', href: 'https://www.canva.com', kind: 'tool' },
  { name: 'Figma', icon: 'Figma', href: 'https://www.figma.com', kind: 'tool' },
  { name: 'Aseprite', icon: 'Aseprite', href: 'https://www.aseprite.org', kind: 'tool' },
  { name: 'Blender', icon: 'Blender', href: 'https://www.blender.org', kind: 'tool' },

  // ── Web ──
  { name: 'Next.js', icon: 'Next.js', hex: '#F4EADF', href: 'https://nextjs.org', kind: 'tool' },
  { name: 'React', icon: 'React', href: 'https://react.dev', kind: 'tool' },
  { name: 'Tailwind CSS', icon: 'Tailwind CSS', href: 'https://tailwindcss.com', kind: 'tool' },
  { name: 'Vercel', icon: 'Vercel', hex: '#F4EADF', href: 'https://vercel.com', kind: 'tool' },
  { name: 'Git', icon: 'Git', href: 'https://git-scm.com', kind: 'tool' },

  // ── Languages (no links) ──
  { name: 'HTML', icon: 'HTML5', kind: 'language' },
  { name: 'CSS', icon: 'CSS', hex: '#D08BF0', kind: 'language' },
  { name: 'JavaScript', icon: 'JavaScript', kind: 'language' },
  { name: 'TypeScript', icon: 'TypeScript', hex: '#6FA8E8', kind: 'language' },
];
