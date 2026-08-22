'use client';

import { useEffect, useRef, useState } from 'react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { reviews, avatarFor, type Review } from '@/data/reviews';
import PixelAvatar from './PixelAvatar';

const tagColor: Record<string, string> = {
  Design: 'var(--color-accent)',
  Video: 'var(--color-accent2)',
  Web: 'var(--color-blush)',
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        // Fraction of this particular star that should be filled.
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative block h-3.5 w-3.5">
            <svg viewBox="0 0 20 20" className="absolute inset-0 h-full w-full fill-line">
              <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
            </svg>
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-full w-3.5 fill-amber-400"
                preserveAspectRatio="xMinYMid meet"
              >
                <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}

function Card({ review }: { review: Review }) {
  const color = review.tag ? tagColor[review.tag] : 'var(--color-accent)';
  return (
    <figure className="grad-border group relative rounded-2xl border border-line bg-surface/70 p-5 transition-colors duration-500 hover:bg-surface">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        {review.tag && (
          <span
            className="rounded-full border border-line px-2 py-0.5 text-[10px] font-medium tracking-wide"
            style={{ color }}
          >
            {review.tag}
          </span>
        )}
      </div>

      <blockquote className="mt-3.5 text-[13.5px] leading-relaxed text-muted transition-colors duration-500 group-hover:text-ink/90">
        {review.text}
      </blockquote>

      <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
        <PixelAvatar
          name={review.name}
          src={avatarFor(review)}
          className="h-9 w-9 shrink-0 rounded-full border border-line object-cover"
        />
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-medium text-ink">
            {review.name}
          </span>
          <span className="block truncate text-[11.5px] text-muted">{review.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * One vertical lane. Scrolls forever by translating a doubled list and
 * wrapping at the halfway point. Velocity lerps toward zero on hover, so it
 * glides to a stop rather than freezing mid-motion.
 */
function Column({
  items,
  speed,
  direction,
}: {
  items: Review[];
  speed: number; // px per second
  direction: 'up' | 'down';
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dir = direction === 'up' ? -1 : 1;
    let offset = direction === 'up' ? 0 : -track.scrollHeight / 2;
    let velocity = 0;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0,
    });
    io.observe(track);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05); // clamp after tab switches
      last = now;
      if (!visible || document.hidden) return;

      const target = pausedRef.current ? 0 : speed * dir;
      // Frame-rate independent easing toward the target velocity.
      velocity += (target - velocity) * (1 - Math.exp(-dt * 6));

      offset += velocity * dt;

      const half = track.scrollHeight / 2;
      if (half > 0) {
        if (offset <= -half) offset += half;
        if (offset >= 0) offset -= half;
      }

      track.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [speed, direction]);

  return (
    <div
      className="mask-y relative h-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div ref={trackRef} className="will-change-transform">
        {/* Rendered twice so the wrap point is invisible. */}
        {[0, 1].map((pass) => (
          <div key={pass} className="flex flex-col gap-4 pb-4">
            {items.map((r, i) => (
              <Card key={`${pass}-${r.name}-${i}`} review={r} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  // Deal the reviews into three lanes so no lane repeats a name.
  const lanes: Review[][] = [[], [], []];
  reviews.forEach((r, i) => lanes[i % 3].push(r));

  const average =
    Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;

  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 overflow-hidden py-28 sm:py-36"
    >
      {/* Ambient wash behind the lanes */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-[520px] opacity-30 blur-[130px]"
        style={{
          background:
            'radial-gradient(50% 50% at 25% 50%, var(--color-accent), transparent 70%), radial-gradient(45% 50% at 78% 45%, var(--color-accent2), transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="04"
          eyebrow="Kind words"
          title="What it's like to work with me."
          subtitle="Hover any column to hold it still and read properly."
          align="center"
        />

        <Reveal delay={0.12}>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Stars rating={average} />
            <span className="text-sm text-muted">
              <span className="font-semibold text-ink">{average.toFixed(1)}</span> average
              across {reviews.length} reviews
            </span>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-5">
        <div className="grid h-[560px] grid-cols-1 gap-4 sm:h-[620px] sm:grid-cols-2 lg:grid-cols-3">
          <Column items={lanes[0]} speed={26} direction="up" />
          {/* Middle lane runs the other way for a bit of counter-motion. */}
          <div className="hidden h-full sm:block">
            <Column items={lanes[1]} speed={20} direction="down" />
          </div>
          {/* Third lane only appears once there is room for three. */}
          <div className="hidden h-full lg:block">
            <Column items={lanes[2]} speed={31} direction="up" />
          </div>
        </div>
      </div>
    </section>
  );
}
