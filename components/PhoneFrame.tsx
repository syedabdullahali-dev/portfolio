'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { parseVideoUrl } from '@/lib/media';
import { useRichVisuals } from '@/lib/hooks';
import type { Project } from '@/data/projects';

/**
 * One vertical cut, standing in a phone bezel.
 *
 * The poster carries the frame until the phone is actually on screen, then
 * the chromeless muted player fades in behind it — so the row reads as three
 * phones *playing*, not three screenshots. Clicking hands off to the lightbox,
 * where the clip gets its real size and its controls.
 *
 * The iframe is pointer-events-none on purpose: the whole frame is one button,
 * and the player would otherwise swallow the click meant for it.
 */
export default function PhoneFrame({
  project,
  index = 0,
  onOpen,
}: {
  project: Project;
  index?: number;
  onOpen: (p: Project) => void;
}) {
  const video = parseVideoUrl(project.link);
  const rich = useRichVisuals();
  const screenRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Only autoplay what's on screen — four players running behind the fold is
  // a lot of decode for something nobody is looking at. Mounting them a beat
  // apart keeps the whole row from hitting the network in one burst.
  useEffect(() => {
    if (!rich || !video) return;
    const el = screenRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        clearTimeout(timer);
        if (e.isIntersecting) timer = setTimeout(() => setLive(true), index * 300);
        else setLive(false);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [rich, video, index]);

  const open = () => onOpen(project);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="group m-0 flex w-[clamp(152px,24vw,244px)] flex-col items-center"
    >
      <div className="relative w-full">
        {/* Warm pool of light under the handset, lit on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -bottom-6 -top-4 -z-10 rounded-[3.5rem] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(60% 55% at 50% 60%, color-mix(in oklab, var(--color-accent) 40%, transparent), transparent 72%)',
          }}
        />

        <div
          role="button"
          tabIndex={0}
          data-cursor="hover"
          aria-label={`Play ${project.title}`}
          onClick={open}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              open();
            }
          }}
          className="relative block w-full cursor-pointer rounded-[2.15rem] border border-line bg-gradient-to-b from-surface-2 via-surface to-bg-soft p-[5px] shadow-[0_34px_70px_-32px_rgba(0,0,0,0.95)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {/* Side buttons — volume rocker and the lock key */}
          <span aria-hidden className="absolute -left-[2px] top-[21%] h-7 w-[2px] rounded-full bg-line" />
          <span aria-hidden className="absolute -left-[2px] top-[30%] h-7 w-[2px] rounded-full bg-line" />
          <span aria-hidden className="absolute -right-[2px] top-[26%] h-12 w-[2px] rounded-full bg-line" />

          <div
            ref={screenRef}
            className="relative block aspect-[9/16] w-full overflow-hidden rounded-[1.8rem] bg-black"
          >
            {/* The poster stays put underneath for good: if the player is slow,
                blocked or refused, the screen still shows the work rather than
                going black. The iframe simply fades in over it. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image || video?.poster || ''}
              alt={project.title}
              loading="lazy"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {live && video && (
              <iframe
                src={video.loop}
                title={project.title}
                tabIndex={-1}
                aria-hidden
                loading="lazy"
                onLoad={() => setPlaying(true)}
                allow="autoplay; picture-in-picture"
                className={clsx(
                  'pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-1000',
                  playing ? 'opacity-100' : 'opacity-0'
                )}
              />
            )}

            {/* Keeps the caption legible over a bright frame */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"
            />

            {project.duration && (
              <span className="pixel-label pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/55 px-1.5 py-0.5 text-[8px] text-blush/90 backdrop-blur-sm">
                {project.duration}
              </span>
            )}

            {/* Play affordance — always faintly there, full strength on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-blush/90 text-bg opacity-0 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100 group-hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
          </div>

          {/* Camera pill */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[13px] h-[7px] w-11 -translate-x-1/2 rounded-full bg-bg ring-1 ring-white/[0.06]"
          />
        </div>
      </div>

      <figcaption className="mt-6 px-2 text-center">
        <h4 className="font-display text-[15px] font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-accent-soft">
          {project.title}
        </h4>
        <p className="pixel-label mt-2 text-[8px] leading-relaxed text-muted">
          {project.tools.join(' · ')}
          {project.year ? ` · ${project.year}` : ''}
        </p>
      </figcaption>
    </motion.figure>
  );
}
