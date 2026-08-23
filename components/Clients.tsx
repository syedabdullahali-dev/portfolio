'use client';

import { useEffect, useRef, useState } from 'react';
import { clients } from '@/data/site';

/**
 * The one band on the page that isn't espresso.
 *
 * Everything else runs in a single dark value from the hero to the footer,
 * which reads as one long tone however well-spaced it is. Inverting this strip
 * to cream gives the eye a landmark, breaks the scroll into a before and an
 * after, and — because it is opaque — proves the field behind it is a
 * background rather than a texture painted on the sections.
 *
 * Horizontal motion in a page that is otherwise entirely vertical does the
 * same job a second way.
 *
 * Keep it honest: a name goes here once work for them has actually shipped.
 */
export default function Clients() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Same velocity-lerp as the nav ticker and the review columns: hovering
  // eases it to a stop rather than snapping, and it survives a tab-switch
  // without jumping a chunk of the track.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SPEED = 38; // px per second
    let offset = 0;
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
    <section
      className="relative overflow-hidden py-11 sm:py-14"
      style={{
        // Warm cream rather than white — the inversion should still read as
        // the same lamp, turned up.
        background:
          'linear-gradient(180deg, #F7E6C6 0%, var(--color-blush) 55%, #E8CEA3 100%)',
      }}
      aria-label="Clients"
    >
      <p
        className="pixel-label text-center text-[9px]"
        style={{ color: 'color-mix(in oklab, var(--color-bg) 64%, transparent)' }}
      >
        Worked with
      </p>

      <div
        className="mask-x mt-7 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div ref={trackRef} className="flex w-max items-center will-change-transform">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-center" aria-hidden={pass === 1}>
              {clients.map((name) => (
                <span key={`${pass}-${name}`} className="flex items-center">
                  <span
                    className="whitespace-nowrap px-7 font-display text-[19px] font-semibold tracking-tight transition-colors duration-300 sm:px-9 sm:text-[26px]"
                    style={{ color: 'var(--color-bg)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-accent2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-bg)';
                    }}
                  >
                    {name}
                  </span>
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rotate-45 rounded-[1px]"
                    style={{ background: 'var(--color-accent2)', opacity: 0.55 }}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
