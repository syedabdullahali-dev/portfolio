'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { site } from '@/data/site';

const NAME = site.name.split(' ');

const disciplines = ['Graphic Design', 'Video Editing', 'Landing Pages'];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Content drifts up and fades as you scroll past — cheap sense of depth.
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '38%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-24"
    >
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto w-full max-w-4xl text-center"
      >
        {/* Availability pill */}
        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass group mb-8 inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-2 text-xs font-medium tracking-wide text-muted transition-colors hover:text-ink"
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inset-0 rounded-full bg-emerald-400"
              style={{ animation: 'pulse-ring 2.4s ease-out infinite' }}
            />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Available for new projects
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </motion.a>

        <h1 className="font-display text-[clamp(2.6rem,9vw,6.2rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
          {NAME.map((word, wi) => (
            <span key={word} className="mr-[0.25em] inline-block">
              {word.split('').map((ch, ci) => (
                <motion.span
                  key={`${ch}-${ci}`}
                  initial={{ opacity: 0, y: 40, rotateX: -70 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: 0.35 + wi * 0.12 + ci * 0.035,
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block will-change-transform"
                  style={{ transformOrigin: 'bottom' }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Disciplines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted sm:text-base"
        >
          {disciplines.map((d, i) => (
            <span key={d} className="flex items-center gap-3">
              <span className="text-gradient font-medium">{d}</span>
              {i < disciplines.length - 1 && (
                <span className="text-line" aria-hidden>
                  ✦
                </span>
              )}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#work"
            className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-accent to-accent2 px-7 py-3.5 text-sm font-semibold text-bg shadow-[0_10px_40px_-10px_rgba(239,163,62,0.55)] transition-transform duration-300 hover:scale-[1.04] active:scale-95 sm:w-auto"
          >
            <span className="relative z-10">See my work</span>
            <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-full" />
          </a>
          <a
            href="#contact"
            className="glass w-full rounded-full border border-line px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:border-accent/60 hover:scale-[1.04] active:scale-95 sm:w-auto"
          >
            Work with me
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-[22px] items-start justify-center rounded-full border border-line/80 p-1.5">
          <motion.span
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1 rounded-full bg-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}
