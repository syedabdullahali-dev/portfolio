'use client';

import { useEffect, useRef, useState } from 'react';
import { stack, type StackItem } from '@/data/stack';
import { ICON_PATHS } from '@/data/icon-paths';

function Mark({ item }: { item: StackItem }) {
  // Adobe / Canva: their own monogram tile rather than a look-alike logo file.
  if (item.monogram) {
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] border text-[10px] font-bold leading-none"
        style={{
          color: item.hex,
          borderColor: `color-mix(in oklab, ${item.hex} 45%, transparent)`,
          background: `color-mix(in oklab, ${item.hex} 12%, transparent)`,
        }}
        aria-hidden
      >
        {item.monogram}
      </span>
    );
  }

  const icon = item.icon ? ICON_PATHS[item.icon] : undefined;
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0"
      fill={item.hex ?? icon.hex}
      aria-hidden
    >
      <path d={icon.path} />
    </svg>
  );
}

function Item({ item }: { item: StackItem }) {
  const inner = (
    <>
      <Mark item={item} />
      <span className="whitespace-nowrap text-[13px] font-medium text-muted transition-colors duration-300 group-hover/chip:text-ink">
        {item.name}
      </span>
      {item.href && (
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3 shrink-0 -translate-x-1 stroke-current text-muted opacity-0 transition-all duration-300 group-hover/chip:translate-x-0 group-hover/chip:opacity-100"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M7 17L17 7M9 7h8v8" />
        </svg>
      )}
    </>
  );

  const cls =
    'group/chip flex items-center gap-2.5 rounded-full border border-line bg-surface/50 px-3.5 py-2 transition-all duration-300';

  if (!item.href) {
    // Languages are not links — just chips.
    return <span className={cls}>{inner}</span>;
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      title={`${item.name} — opens in a new tab`}
      className={`${cls} hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface`}
    >
      {inner}
    </a>
  );
}

/**
 * Infinite horizontal marquee under the nav.
 * Same velocity-lerp trick as the review columns, so hovering eases it to a
 * stop instead of snapping, and it survives tab-switches without jumping.
 */
export default function StackTicker() {
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

    const SPEED = 42; // px per second
    let offset = 0;
    let velocity = 0;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(track);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;

      const target = pausedRef.current ? 0 : -SPEED;
      velocity += (target - velocity) * (1 - Math.exp(-dt * 6));
      offset += velocity * dt;

      // The list is rendered twice; wrap at the halfway mark.
      const half = track.scrollWidth / 2;
      if (half > 0 && offset <= -half) offset += half;

      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div
      className="mask-x relative overflow-hidden py-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-label="Tools and languages I work with"
    >
      <div ref={trackRef} className="flex w-max gap-2.5 will-change-transform">
        {[0, 1].map((pass) => (
          <div key={pass} className="flex gap-2.5" aria-hidden={pass === 1}>
            {stack.map((item) => (
              <Item key={`${pass}-${item.name}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
