export type Review = {
  name: string;
  role: string;
  rating: number; // out of 5, halves allowed
  text: string;
  tag?: 'Design' | 'Video' | 'Web';
  /** Optional explicit avatar path. If omitted, one is picked from the pool below. */
  avatar?: string;
};

// Cropped & compressed from public/avatars by the asset prep step.
export const avatarPool: string[] = [
  "/clients/av-01.webp",
  "/clients/av-02.webp",
  "/clients/av-03.webp",
  "/clients/av-04.webp",
  "/clients/av-05.webp",
  "/clients/av-06.webp",
  "/clients/av-07.webp",
  "/clients/av-08.webp",
  "/clients/av-09.webp",
  "/clients/av-10.webp",
  "/clients/av-11.webp",
  "/clients/av-12.webp",
  "/clients/av-13.webp",
  "/clients/av-14.webp",
  "/clients/av-15.webp",
  "/clients/av-16.webp",
  "/clients/av-17.webp",
  "/clients/av-18.webp",
  "/clients/av-19.webp",
  "/clients/av-20.webp",
  "/clients/av-21.webp",
  "/clients/av-22.webp",
  "/clients/av-23.webp",
  "/clients/av-24.webp",
  "/clients/av-25.webp",
  "/clients/av-26.webp",
  "/clients/av-27.webp"
];



// ─────────────────────────────────────────────────────────────
//  SAMPLE reviews — written as placeholders so the section looks
//  finished. Swap these for real client words as you collect them.
// ─────────────────────────────────────────────────────────────

export const reviews: Review[] = [
  {
    name: 'Hamza Rauf',
    role: 'Founder, Aurora Skincare',
    rating: 5,
    tag: 'Design',
    text: "We'd been through two designers before Syed and both gave us something that looked like a template. He actually asked what our customers care about first. The packaging labels are now the thing people mention in reviews.",
  },
  {
    name: 'Daniela Rossi',
    role: 'Content Creator',
    rating: 5,
    tag: 'Video',
    text: 'Sent him 40 minutes of raw gameplay at 1am and had a 3 minute montage back the next evening. The beat syncing is stupidly clean.',
  },
  {
    name: 'Marcus Bell',
    role: 'Co-founder, Northwind',
    rating: 5,
    tag: 'Web',
    text: 'Our landing page went live in nine days. Sign-ups roughly doubled in the first month, and honestly a chunk of that is just that the page finally looks like a company people can trust.',
  },
  {
    name: 'Aisha Khan',
    role: 'Marketing Lead',
    rating: 4.5,
    tag: 'Design',
    text: "Great eye and very fast. Only note is that the first round of ad creatives leaned more artsy than we needed — said so, and round two was exactly right. Zero ego about revisions, which I really appreciate.",
  },
  {
    name: 'Tom Verhoeven',
    role: 'YouTuber, 180k subs',
    rating: 5,
    tag: 'Video',
    text: 'The thumbnails he made moved my CTR from 4.1% to 6.8%. I have the analytics screenshot saved. That is not a small difference at my size.',
  },
  {
    name: 'Priya Nair',
    role: 'Owner, Cafe Ravel',
    rating: 5,
    tag: 'Web',
    text: 'I am not a tech person at all and I was dreading this. He walked me through every step in plain language and I can now update the menu myself in about two minutes.',
  },
  {
    name: 'Jordan Msonda',
    role: 'Music Producer',
    rating: 5,
    tag: 'Design',
    text: 'Six covers, one brief, no back and forth needed. He got the whole mood of the label from a playlist link.',
  },
  {
    name: 'Elena Petrova',
    role: 'Brand Manager, FitPulse',
    rating: 4.5,
    tag: 'Design',
    text: 'Delivered a day past the deadline but told me two days before it would happen and why, which frankly puts him ahead of most agencies I have worked with. Work itself was excellent.',
  },
  {
    name: 'Ryan Doyle',
    role: 'Startup Founder',
    rating: 5,
    tag: 'Web',
    text: 'What sold me was that he pushed back on half my ideas. I wanted a carousel, he explained why nobody clicks them, and he was right.',
  },
  {
    name: 'Sana Iqbal',
    role: 'E-commerce Owner',
    rating: 5,
    tag: 'Video',
    text: 'Nine vertical reels from one afternoon of footage. Two of them went past 100k views. Already booked him for the next batch.',
  },
  {
    name: 'Chris Okafor',
    role: 'Agency Creative Director',
    rating: 5,
    tag: 'Video',
    text: 'I hire editors for a living and good ones are rare. The colour grade on the founder film was genuinely better than what our in-house guy delivers. He is now on our freelance roster.',
  },
  {
    name: 'Lucia Fernandes',
    role: 'Freelance Photographer',
    rating: 5,
    tag: 'Design',
    text: 'Rebuilt my whole portfolio identity for a price that felt almost unfair to him. Communicative the entire way through, and he actually reads your messages properly.',
  },
  {
    name: 'Bilal Ahmed',
    role: 'Product Lead',
    rating: 4.5,
    tag: 'Web',
    text: 'Site is quick and looks great. Would have liked slightly more documentation handed over at the end, but he answered every question I sent afterwards anyway.',
  },
  {
    name: 'Nora Lindqvist',
    role: 'Course Creator',
    rating: 5,
    tag: 'Video',
    text: 'He cut 22 lesson videos for me over three weeks and the pacing is consistent across every single one. That consistency is the hard part and most editors miss it.',
  },
  {
    name: 'Adeel Shah',
    role: 'Restaurant Group',
    rating: 5,
    tag: 'Design',
    text: 'Menus, signage, delivery stickers, the lot. Everything matched, everything arrived print-ready with bleed set up properly. No panicked calls from the printer for once.',
  },
];

// ─────────────────────────────────────────────────────────────
//  Avatar assignment — every reviewer gets a DIFFERENT face.
//  The pool is shuffled with a fixed seed (never Math.random, which
//  would differ between server and client and break hydration), then
//  dealt out one per reviewer. If there are more reviewers than faces,
//  the leftovers get no `src` and PixelAvatar draws them a generated
//  pixel creature instead of repeating someone else's picture.
// ─────────────────────────────────────────────────────────────

const assigned = new Map<string, string>();

{
  const pool = [...avatarPool];
  let seed = 20260822;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  let next = 0;
  for (const r of reviews) {
    if (r.avatar) continue;          // explicit photo wins
    if (next >= pool.length) break;  // out of faces — generate instead
    assigned.set(r.name, pool[next]);
    next += 1;
  }
}

/** Returns undefined when there's no free face, so a pixel avatar is drawn. */
export function avatarFor(r: Review): string | undefined {
  return r.avatar ?? assigned.get(r.name);
}
