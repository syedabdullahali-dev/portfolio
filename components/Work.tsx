'use client';

import { useMemo, useState, type ReactNode } from 'react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import Lightbox from './Lightbox';
import OrbitGallery from './OrbitGallery';
import PhoneFrame from './PhoneFrame';
import { projects, services, type Project } from '@/data/projects';

/**
 * One service, one row. Same header, same rhythm, same gap above and below —
 * the three rows should feel like three verses of the same thing rather than
 * three different layouts that happen to share a page.
 */
function ServiceRow({
  index,
  label,
  note,
  children,
}: {
  index: string;
  label: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Reveal>
        <div className="flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-baseline md:justify-between md:gap-12">
          <div className="flex items-baseline gap-3.5">
            <span className="pixel-label text-[10px] text-accent">{index}</span>
            <h3 className="font-display text-[clamp(1.4rem,2.8vw,2rem)] font-semibold tracking-tight">
              {label}
            </h3>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted md:text-right">{note}</p>
        </div>
      </Reveal>

      <div className="mt-12 sm:mt-14">{children}</div>
    </div>
  );
}

/**
 * Landing-page card. Every one is the same width and the same height, with the
 * same 16:10 window on top — two of them side by side should read as a pair,
 * not as a big one and a small one.
 */
function WebCard({ project, index }: { project: Project; index: number }) {
  const open = () => {
    if (project.link) window.open(project.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Reveal delay={index * 0.1}>
      <TiltCard strength={5} className="group h-full">
        <div
          role="button"
          tabIndex={0}
          data-cursor="hover"
          aria-label={`Visit ${project.title}`}
          onClick={open}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              open();
            }
          }}
          className="grad-border relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-line bg-surface/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

            {project.year && (
              <span className="pixel-label absolute right-4 top-4 text-[9px] text-blush/60">
                {project.year}
              </span>
            )}

            <span
              aria-hidden
              className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-blush text-bg opacity-0 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-0 group-hover:opacity-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </span>
          </div>

          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <h4 className="font-display text-[17px] font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-accent-soft">
              {project.title}
            </h4>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">{project.description}</p>
            {/* mt-auto pins the tool row to the bottom, so both cards line up */}
            <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
              {project.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-bg-soft px-2.5 py-1 text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

export default function Work() {
  const [active, setActive] = useState<Project | null>(null);

  const byCategory = useMemo(
    () => ({
      design: projects.filter((p) => p.category === 'design'),
      video: projects.filter((p) => p.category === 'video'),
      web: projects.filter((p) => p.category === 'web'),
    }),
    []
  );

  const rows: Record<string, ReactNode> = {
    design: <OrbitGallery items={byCategory.design} onOpen={setActive} />,

    // Capped at three handsets a row: the wrapper is exactly three phones plus
    // two gaps wide, so a fourth clip drops to a second row and centres itself
    // rather than stretching the first one out of symmetry.
    video: (
      <div className="mx-auto flex max-w-[860px] flex-wrap items-start justify-center gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-16">
        {byCategory.video.map((p, i) => (
          <PhoneFrame key={p.title} project={p} index={i} onOpen={setActive} />
        ))}
      </div>
    ),

    web: (
      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 sm:gap-6">
        {byCategory.web.map((p, i) => (
          <WebCard key={p.title} project={p} index={i} />
        ))}
      </div>
    ),
  };

  return (
    <section id="work" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28 sm:py-36">
      <SectionHeading
        index="02"
        eyebrow="Selected work"
        title="Things I made for people who had a deadline."
        subtitle="Three services, three rows — the whole of each, in the order I'd walk you through it."
      />

      <div className="mt-16 flex flex-col gap-24 sm:mt-20 sm:gap-28">
        {services.map((s) => (
          <ServiceRow key={s.id} index={s.index} label={s.label} note={s.note}>
            {rows[s.id]}
          </ServiceRow>
        ))}
      </div>

      <Lightbox project={active} onClose={() => setActive(null)} />
    </section>
  );
}
