'use client';

import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { projects, type Category } from '@/data/projects';
import Reveal from './Reveal';
import TiltCard from './TiltCard';

type Pillar = {
  icon: React.ReactNode;
  title: string;
  blurb: string;
  /** Which slice of `projects` this pillar counts. */
  category: Category;
  deliverables: string[];
  tools: string[];
  accent: string;
  /** Small caveat shown under the deliverables list. */
  note?: string;
};

const Pen = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-5 w-5 stroke-current">
    <path d="M12 19l7-7-4-4-7 7-1 5 5-1z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 8l1-1a2.1 2.1 0 013 3l-1 1" strokeLinecap="round" />
  </svg>
);

const Play = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-5 w-5 stroke-current">
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M10 9.5l5 2.5-5 2.5v-5z" strokeLinejoin="round" />
  </svg>
);

const Code = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-5 w-5 stroke-current">
    <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const pillars: Pillar[] = [
  {
    icon: Pen,
    title: 'Graphic Design',
    blurb:
      'Identity work that holds up everywhere — from a favicon to a shopfront sign.',
    category: 'design',
    deliverables: ['Logo & brand identity', 'Social & ad creative', 'Packaging & print', 'Thumbnails'],
    tools: ['Photoshop', 'Illustrator', 'Canva', 'Figma', 'Blender'],
    accent: 'var(--color-accent)',
  },
  {
    icon: Play,
    title: 'Video Editing',
    blurb:
      'Pacing, sound and colour that keep people watching well past the hook.',
    category: 'video',
    deliverables: ['Brand films', 'Shorts & reels', 'Montages', 'Motion graphics'],
    tools: ['CapCut Pro', 'Premiere Pro', 'After Effects', 'DaVinci'],
    accent: 'var(--color-accent2)',
    note: "I don't add music to edits — I avoid it for religious reasons. Every cut is built to carry itself on pacing and sound design, and you're free to lay your own track over the final file.",
  },
  {
    icon: Code,
    title: 'Landing Pages',
    blurb:
      'Fast, responsive one-pagers built to turn visitors into enquiries.',
    category: 'web',
    deliverables: ['Landing pages', 'Portfolio sites', 'Scroll animation', 'Responsive builds'],
    tools: ['Next.js', 'React', 'Tailwind', 'Framer Motion'],
    accent: 'var(--color-blush)',
  },
];

function Count({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex shrink-0 flex-col items-end">
      <motion.span
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="pixel-label text-2xl leading-none"
        style={{ color }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="pixel-label mt-1 text-[8px] text-muted">
        {value === 1 ? 'piece' : 'pieces'}
      </span>
    </div>
  );
}

export default function Skills() {
  // Real figures, straight from the work that's actually on the page.
  const counts = projects.reduce(
    (acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }),
    {} as Record<Category, number>
  );

  return (
    <section
      id="skills"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28 sm:py-36"
    >
      <SectionHeading
        index="01"
        eyebrow="What I do"
        title="Three crafts, one consistent standard."
        subtitle="Hire me for one of these or all three — the advantage of the third option is that nothing gets lost in translation between people."
        align="center"
      />

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.12}>
            <TiltCard strength={8} className="group h-full">
              <article className="grad-border relative flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-7 transition-colors duration-500 hover:bg-surface">
                {/* Glow puck behind the icon */}
                <div
                  className="pointer-events-none absolute -top-10 left-6 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-45"
                  style={{ background: p.accent }}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-surface-2 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                    style={{ color: p.accent, transform: 'translateZ(35px)' }}
                  >
                    {p.icon}
                  </div>
                  <Count value={counts[p.category]} color={p.accent} />
                </div>

                <h3
                  className="relative mt-6 font-display text-xl font-semibold tracking-tight"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  {p.title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-muted">
                  {p.blurb}
                </p>

                <p className="pixel-label relative mt-6 border-t border-line pt-5 text-[9px] text-muted">
                  What I take on
                </p>
                <ul className="relative mt-3.5 space-y-2.5">
                  {p.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2.5 text-sm text-muted">
                      <span
                        className="h-1 w-1 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-150"
                        style={{ background: p.accent }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>

                {p.note && (
                  <p className="relative mt-5 flex gap-2 rounded-2xl border border-line bg-bg-soft/60 p-3 text-[12px] leading-relaxed text-muted">
                    <span aria-hidden style={{ color: p.accent }}>
                      &#9834;
                    </span>
                    <span>{p.note}</span>
                  </p>
                )}

                <div className="relative mt-auto flex flex-wrap gap-1.5 pt-7">
                  {p.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-bg-soft px-2.5 py-1 text-[11px] text-muted transition-colors duration-300 group-hover:border-line group-hover:text-ink"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
