'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import AboutCard from './AboutCard';
import { projects } from '@/data/projects';

// Derived from the work on the page rather than asserted, so these can't
// drift out of sync with reality. Edit the labels freely — just don't put a
// claim here you can't back up.
const earliestYear = projects
  .map((p) => p.year)
  .filter((y): y is string => Boolean(y))
  .sort()[0];

const facts = [
  { k: 'Based in', v: 'Remote · Worldwide' },
  { k: 'Working since', v: earliestYear ?? '—' },
  { k: 'Best contact', v: 'Email · Discord' },
  { k: 'Currently', v: 'Taking on new work' },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const blobY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);

  return (
    <section
      ref={ref}
      id="about"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28 sm:py-36"
    >
      {/* Ambient blob, drifts opposite the scroll */}
      <motion.div
        style={{ y: blobY }}
        className="pointer-events-none absolute -left-40 top-24 -z-10 h-[420px] w-[420px] rounded-full opacity-25 blur-[110px]"
      >
        <div className="h-full w-full rounded-full bg-accent" />
      </motion.div>

      <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        {/* Portrait */}
        <div className="order-2 lg:order-1">
          <TiltCard strength={7} className="group">
            <AboutCard imgY={imgY} />
          </TiltCard>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <SectionHeading
            index="01"
            eyebrow="About"
            title="I make brands look like they mean it."
          />

          <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-muted sm:text-base">
            <Reveal delay={0.1}>
              <p>
                I&apos;m <span className="text-ink">Syed Abdullah Ali</span>. I make
                things for game communities — server branding, pixel key art, promo
                edits, and the pages they all point at.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p>
                Most of my work so far has been pixel art: logotypes drawn at pixel
                scale so they survive being shrunk to a server icon, banners that still
                read as a thumbnail, and social sets built on one template so a whole
                series stays consistent.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <p>
                Doing the design, the edit and the build myself means nothing gets lost
                being handed between people — the thing you saw in the mockup is the
                thing that ships.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.34}>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-8">
              {facts.map((f) => (
                <div key={f.k}>
                  <dt className="pixel-label text-[9px] text-muted">{f.k}</dt>
                  <dd className="mt-1.5 text-sm font-medium text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
