'use client';

import Reveal, { RevealWords } from './Reveal';

export default function SectionHeading({
  index,
  eyebrow,
  title,
  subtitle,
  align = 'left',
}: {
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Reveal>
        <div
          className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
        >
          <span className="pixel-label text-[10px] text-accent">{index}</span>
          <span className="h-px w-8 bg-gradient-to-r from-accent to-transparent" />
          <span className="pixel-label text-[10px] text-muted">{eyebrow}</span>
        </div>
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
