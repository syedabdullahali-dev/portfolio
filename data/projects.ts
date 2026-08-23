export type Category = 'design' | 'video' | 'web';

export type Project = {
  /** Shown on the card */
  title: string;
  /** One line. What it was / what it did. */
  description: string;
  category: Category;
  /** Path inside /public, e.g. '/work/design/opt/thing.webp'. Leave '' for an auto gradient placeholder. */
  image: string;
  /** Live site URL (web) or Vimeo/YouTube URL (video). Optional. */
  link?: string;
  /** Small MP4 in /public/work/video/ for inline playback. Optional. */
  video?: string;
  tools: string[];
  /** Runtime as shown on the phone frame, e.g. '0:34'. Video only. */
  duration?: string;
  /** Vertical (9:16) media — reels, shorts. Gives the card a portrait frame. */
  portrait?: boolean;
  /** Contain rather than cover — for logos that shouldn't be cropped. */
  contain?: boolean;
  year?: string;
};

// ─────────────────────────────────────────────────────────────
//  Add work here. Images live in /public/work/<category>/opt/
//  (run the assets through sharp first — the raw PNGs are huge).
// ─────────────────────────────────────────────────────────────

export const projects: Project[] = [
  // ── Design ──────────────────────────────────────────────
  {
    title: 'Super Clankers — Server Banner',
    description:
      'Key art for a Minecraft SMP: hand-placed pixel brickwork, torch glow and a pixel wordmark built to stay legible as a small thumbnail.',
    category: 'design',
    image: '/work/design/opt/clankers-banner.webp',
    tools: ['Photoshop', 'Aseprite'],
    year: '2026',
  },
  {
    title: 'Super Clankers — Pixel Wordmark',
    description: 'The logotype on its own, drawn at pixel scale with a chunky bevel so it survives being shrunk.',
    category: 'design',
    image: '/work/design/opt/clankers-logo.webp',
    tools: ['Aseprite', 'Illustrator'],
    contain: true,
    year: '2026',
  },
  {
    title: 'AIMS School SMP — Server Logo',
    description: 'Badge mark for a school Minecraft server, pairing the institution crest with a grass-block render.',
    category: 'design',
    image: '/work/design/opt/school-smp.webp',
    tools: ['Photoshop'],
    contain: true,
    year: '2025',
  },
  {
    title: 'SMP Guides — Social Set',
    description: 'Pixel-scene social graphics for server how-to posts, built on one reusable template.',
    category: 'design',
    image: '/work/design/opt/mc-download.webp',
    tools: ['Canva', 'Photoshop'],
    year: '2025',
  },
  {
    title: 'Voice Chat Guide — Social Post',
    description: 'Second card in the same series, keeping type scale and palette consistent across the set.',
    category: 'design',
    image: '/work/design/opt/mc-voicechat.webp',
    tools: ['Canva'],
    year: '2025',
  },

  // ── Video ───────────────────────────────────────────────
  {
    title: 'Infinity Realms — Server Demo',
    description:
      'A 34-second vertical walk through the Infinity Realms spawn, cut with large on-screen captions so it still reads with the sound off.',
    category: 'video',
    image: '/work/video/infinity-realms.webp',
    link: 'https://vimeo.com/1220584986',
    duration: '0:34',
    tools: ['Premiere Pro'],
    portrait: true,
    year: '2026',
  },
  {
    title: 'Super Clankers SMP — Promo',
    description: 'A 34-second vertical promo cut for the server: quick pacing, pixel-styled titles and beat-matched cuts.',
    category: 'video',
    image: '/work/video/clankers-smp.webp',
    link: 'https://vimeo.com/1220390993',
    duration: '0:34',
    tools: ['Premiere Pro', 'After Effects'],
    portrait: true,
    year: '2026',
  },
  {
    title: 'Tulip SMP — Promo',
    description: 'A 31-second vertical trailer for Tulip Survival, built to sell the server in the first three seconds of a scroll.',
    category: 'video',
    image: '/work/video/tulip-smp.webp',
    link: 'https://vimeo.com/1220390998',
    duration: '0:31',
    tools: ['Premiere Pro'],
    portrait: true,
    year: '2026',
  },

  {
    title: 'Meme Edit — Short Form',
    description:
      'A 24-second vertical cut built for the punchline: tight timing, no wasted frames before the joke lands.',
    category: 'video',
    image: '/work/video/meme-edit.webp',
    link: 'https://vimeo.com/1220403591',
    duration: '0:24',
    tools: ['Premiere Pro'],
    portrait: true,
    year: '2026',
  },

  // ── Web ─────────────────────────────────────────────────
  {
    title: 'Aura Architecture — Landing Page',
    description:
      'Landing page for an architecture studio: editorial serif headline, an interactive 3D Spline scene, and a single clear route to a consultation booking.',
    category: 'web',
    image: '/work/web/aura.webp',
    link: 'https://aura-architecture-fh22-pvgj7hzaz.vercel.app/',
    tools: ['Next.js', 'Tailwind', 'Spline', 'Vercel'],
    year: '2026',
  },
  {
    title: 'Forma House — Architecture Studio',
    description:
      'Studio landing page built in Framer: full-bleed material photography against an editorial serif, with a single "begin a project" route through the whole page.',
    category: 'web',
    image: '/work/web/forma-house.webp',
    link: 'https://diligent-ocelot-438745.framer.app/',
    tools: ['Framer'],
    year: '2026',
  },
];

/** The three service rows, in the order they stack down the Work section. */
export const services = [
  {
    id: 'design' as const,
    index: '01',
    label: 'Graphic Design',
    note: 'Server banners, logos and social sets, drawn pixel-first so they still read at thumbnail size. Drag the ring to look around it.',
  },
  {
    id: 'video' as const,
    index: '02',
    label: 'Video Editing',
    note: 'Vertical promos cut for the scroll. They play muted here — open one to watch it full size.',
  },
  {
    id: 'web' as const,
    index: '03',
    label: 'Landing Pages',
    note: 'One-page sites with a single clear route through them, built to stay fast on a phone.',
  },
];
