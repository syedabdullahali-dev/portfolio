'use client';

import Reveal, { RevealWords } from './Reveal';

export default function SectionHeading({
  index,
  eyebrow,
  title,
  subtitle,
  align = 'left',
  framed = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  /** Rules on both sides of the eyebrow rather than one leading rule. Used to
   *  give the inverted sections a different opening from the dark ones. */
  framed?: boolean;
}) {
  const centered = align === 'center' || framed;
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Reveal>
        {framed ? (
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent/70" />
            <span className="pixel-label text-[10px] text-accent">{index}</span>
            <span className="pixel-label text-[10px] text-muted">{eyebrow}</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent/70" />
          </div>
        ) : (
          <div
            className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
          >
            <span className="pixel-label text-[10px] text-accent">{index}</span>
            <span className="h-px w-8 bg-gradient-to-r from-accent to-transparent" />
            <span className="pixel-label text-[10px] text-muted">{eyebrow}</span>
          </div>
        )}
      </Reveal>

      <h2 className="mt-5 font-display text-[clamp(2rem,5.2vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.025em]">
        <RevealWords text={title} />
      </h2>

      {subtitle && (
        <Reveal delay={0.15}>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
