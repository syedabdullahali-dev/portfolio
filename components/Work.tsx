'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import clsx from 'clsx';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import Lightbox from './Lightbox';
import OrbitGallery from './OrbitGallery';
import { projects, categories, type Project, type Category } from '@/data/projects';
import { parseVideoUrl, seed } from '@/lib/media';

const accentFor: Record<Category, string> = {
  design: 'var(--color-accent)',
  video: 'var(--color-accent2)',
  web: 'var(--color-blush)',
};

const labelFor: Record<Category, string> = {
  design: 'Design',
  video: 'Video',
  web: 'Web',
};

/** Gradient stand-in used until a real image is dropped into /public/work. */
function Placeholder({ project }: { project: Project }) {
  const s = seed(project.title);
  const a = accentFor[project.category];
  return (
    <div className="absolute inset-0 bg-surface-2">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(70% 65% at ${20 + s * 45}% ${18 + s * 30}%, ${a}, transparent 68%), radial-gradient(60% 60% at ${75 - s * 25}% ${80 - s * 20}%, var(--color-accent2), transparent 70%)`,
          opacity: 0.55,
        }}
      />
      <div className="noise absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-5xl font-bold text-white/10">
          {project.title
            .split(/\s+/)
            .filter((w) => /^[a-z0-9]/i.test(w)) // skip dashes and punctuation
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('')}
        </span>
      </div>
    </div>
  );
}

function Card({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const video = parseVideoUrl(project.link);
  const isVideo = project.category === 'video';
  const hasLink = Boolean(project.link);

  const [posterFailed, setPosterFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // YouTube only generates maxresdefault for some uploads; fall back to the
  // hqdefault thumbnail, which always exists, before giving up on the image.
  const [src, setSrc] = useState(project.image || video?.poster || '');

  const handleError = () => {
    if (video?.kind === 'youtube' && src.includes('maxresdefault')) {
      setSrc(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`);
      return;
    }
    setPosterFailed(true);
  };

  // An image that failed before hydration never fires onError — re-check.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) handleError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const poster = posterFailed ? '' : src;

  const open = () => {
    if (isVideo) return onOpen(project);
    if (hasLink) window.open(project.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className={clsx(project.featured && 'sm:col-span-2')}
    >
      <TiltCard strength={6} className="group h-full">
        <div
          onClick={open}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
          role="button"
          tabIndex={0}
          data-cursor="hover"
          className="grad-border relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-line bg-surface/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div
            className={clsx(
              'relative overflow-hidden',
              project.contain && 'bg-bg-soft',
              project.featured
                ? 'aspect-[16/10]'
                : project.portrait
                  ? 'aspect-[3/4]'
                  : 'aspect-[4/3]'
            )}
          >
            {poster ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                ref={imgRef}
                src={poster}
                alt={project.title}
                onError={handleError}
                loading="lazy"
                className={clsx(
                  'absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]',
                  project.contain ? 'object-contain p-6' : 'object-cover',
                  'pixelated'
                )}
              />
            ) : (
              <Placeholder project={project} />
            )}

            <div
              className={clsx(
                'absolute inset-0 bg-gradient-to-t from-bg to-transparent transition-opacity duration-500',
                project.contain
                  ? 'via-transparent opacity-40'
                  : 'via-bg/25 opacity-80 group-hover:opacity-95'
              )}
            />

            {/* Category chip */}
            <span
              className="glass absolute left-4 top-4 rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium tracking-wide"
              style={{ color: accentFor[project.category] }}
            >
              {labelFor[project.category]}
            </span>

            {project.year && (
              <span className="pixel-label absolute right-4 top-4 text-[9px] text-blush/60">
                {project.year}
              </span>
            )}

            {/* Play / visit affordance */}
            {(isVideo || hasLink) && (
              <div
                className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-blush text-bg opacity-0 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-0 group-hover:opacity-100"
                aria-hidden
              >
                {isVideo ? (
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current">
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 stroke-current"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <h3 className="font-display text-[17px] font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-accent-soft">
              {project.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-1.5 pt-1">
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
    </motion.article>
  );
}

export default function Work() {
  const [filter, setFilter] = useState<string>('all');
  const [active, setActive] = useState<Project | null>(null);

  const shown = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section
      id="work"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28 sm:py-36"
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index="03"
          eyebrow="Selected work"
          title="Things I made for people who had a deadline."
        />

        {/* Filter tabs */}
        <LayoutGroup id="work-filter">
          <div className="glass flex flex-wrap gap-1 self-start rounded-full border border-line p-1 lg:self-end">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={clsx(
                  'relative rounded-full px-4 py-2 text-sm transition-colors duration-300',
                  filter === c.id ? 'text-bg' : 'text-muted hover:text-ink'
                )}
              >
                {filter === c.id && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                  {c.label}
                  {c.id === 'design' && (
                    <span
                      className={clsx(
                        'pixel-label rounded px-1 py-px text-[8px] leading-none transition-colors',
                        filter === c.id ? 'bg-bg/20 text-bg' : 'bg-accent/15 text-accent'
                      )}
                    >
                      3D
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {filter === 'design' ? (
          <motion.div
            key="orbit"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12"
          >
            <OrbitGallery items={shown} onOpen={setActive} />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {shown.map((p) => (
                <Card key={p.title} project={p} onOpen={setActive} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox project={active} onClose={() => setActive(null)} />
    </section>
  );
}
