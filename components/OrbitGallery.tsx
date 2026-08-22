'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '@/data/projects';

type Props = {
  items: Project[];
  onOpen?: (p: Project) => void;
};

const AUTO_SPEED = 7; // degrees per second
const DRAG_SENSITIVITY = 0.32; // degrees per pixel
const FRICTION = 2.6; // how fast flung momentum decays

/**
 * A ring of cards standing on a circle in 3D. The ring auto-rotates, eases to a
 * stop on hover, and can be dragged or flung. Depth shading is written straight
 * to the DOM each frame rather than through React state — at 60fps a re-render
 * per frame would drop frames on mid-range machines.
 */
export default function OrbitGallery({ items, onOpen }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [radius, setRadius] = useState(420);
  const [frontIndex, setFrontIndex] = useState(0);

  // Everything the animation loop mutates lives in refs.
  const angle = useRef(0);
  const velocity = useRef(0); // deg/sec, used for fling momentum
  const hovered = useRef(false);
  const dragging = useRef(false);
  const reduced = useRef(false);

  // With only a handful of images a true one-slot-per-image ring puts the
  // neighbours at ~72°, where they're edge-on and unreadable. Repeating the set
  // fills the cylinder so ~5 distinct cards face the viewer at any moment; the
  // repeat of the front card sits at 180°, hidden by backface culling.
  const unique = items.length;
  const repeats = unique === 0 || unique >= 8 ? 1 : Math.ceil(9 / unique);
  const slots = repeats === 1 ? items : Array.from({ length: unique * repeats }, (_, i) => items[i % unique]);

  const count = slots.length;
  const step = count > 0 ? 360 / count : 0;

  // ── Layout ───────────────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      const w = stageRef.current?.clientWidth ?? 900;
      // Card width scales with the stage; radius is the circumradius that
      // spaces `count` cards of that width evenly without overlapping.
      const cardW = Math.max(150, Math.min(280, w * 0.3));
      const r =
        count > 1
          ? (cardW * 1.12) / (2 * Math.tan(Math.PI / count))
          : 0;
      setRadius(Math.max(260, r));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [count]);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // ── Animation loop ───────────────────────────────────────
  useEffect(() => {
    if (count === 0) return;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let lastFront = -1;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0,
    });
    if (stageRef.current) io.observe(stageRef.current);

    const paint = () => {
      const a = angle.current;
      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(${-radius}px) rotateY(${a}deg)`;
      }

      // Shade each card by how far it is from facing the camera.
      let bestIdx = 0;
      let bestDelta = Infinity;
      for (let i = 0; i < count; i++) {
        const cell = cellRefs.current[i];
        if (!cell) continue;
        // Signed angle between this card and the viewer, in [-180, 180].
        let d = ((a + i * step) % 360 + 540) % 360 - 180;
        const abs = Math.abs(d);
        if (abs < bestDelta) {
          bestDelta = abs;
          bestIdx = i;
        }
        const t = abs / 180; // 0 = facing us, 1 = directly behind
        cell.style.opacity = String(1 - t * 0.72);
        cell.style.filter = `brightness(${(1 - t * 0.55).toFixed(3)}) saturate(${(1 - t * 0.4).toFixed(3)})`;
        // Cards at the back shouldn't swallow clicks meant for the front.
        cell.style.pointerEvents = abs > 60 ? 'none' : 'auto';
        cell.style.zIndex = String(Math.round(200 - abs));
      }

      if (bestIdx !== lastFront) {
        lastFront = bestIdx;
        setFrontIndex(bestIdx);
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;

      if (!dragging.current) {
        if (Math.abs(velocity.current) > 0.5) {
          // Flung — coast to a stop.
          angle.current += velocity.current * dt;
          velocity.current *= Math.exp(-FRICTION * dt);
        } else if (!hovered.current && !reduced.current) {
          velocity.current = 0;
          angle.current += AUTO_SPEED * dt;
        } else {
          velocity.current = 0;
        }
      }

      paint();
    };

    paint();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [count, step, radius]);

  const rotateBy = (deltaSteps: number) => {
    velocity.current = 0;
    const target = angle.current - deltaSteps * step;
    // Short animated nudge rather than a jump.
    const from = angle.current;
    const start = performance.now();
    const dur = 520;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const run = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      angle.current = from + (target - from) * ease(t);
      if (t < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  };

  // ── Dragging ─────────────────────────────────────────────
  const drag = useRef({ startX: 0, lastX: 0, lastT: 0, moved: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    velocity.current = 0;
    drag.current = {
      startX: e.clientX,
      lastX: e.clientX,
      lastT: performance.now(),
      moved: 0,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dx = e.clientX - drag.current.lastX;
    const dt = Math.max((now - drag.current.lastT) / 1000, 0.001);

    angle.current += dx * DRAG_SENSITIVITY;
    // Track instantaneous speed so releasing mid-swipe carries momentum.
    velocity.current = (dx * DRAG_SENSITIVITY) / dt;

    drag.current.lastX = e.clientX;
    drag.current.lastT = now;
    drag.current.moved += Math.abs(dx);
  }, []);

  const endDrag = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already gone */
    }
    // Stale velocity from a long pause before release would fling oddly.
    if (performance.now() - drag.current.lastT > 90) velocity.current = 0;
    velocity.current = Math.max(-900, Math.min(900, velocity.current));
  }, []);

  if (count === 0) return null;

  const front = items[frontIndex % unique];

  return (
    <div className="select-none">
      {/* On narrow screens the ring is wider than the viewport by design — the
          side cards bleed off the edges. This wrapper clips that bleed so it
          can't turn into horizontal page scroll. It sits outside the
          preserve-3d chain, so the 3D rendering is unaffected. */}
      <div className="overflow-hidden py-2">
      <div
        ref={stageRef}
        className="relative mx-auto touch-pan-y rounded-3xl"
        style={{ perspective: '1400px', perspectiveOrigin: '50% 45%' }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Graphic design work — use left and right arrow keys to rotate"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            rotateBy(-1);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            rotateBy(1);
          }
        }}
        onFocus={() => (hovered.current = true)}
        onBlur={() => (hovered.current = false)}
        onPointerEnter={() => (hovered.current = true)}
        onPointerLeave={(e) => {
          hovered.current = false;
          endDrag(e);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="relative mx-auto h-[260px] w-full cursor-grab active:cursor-grabbing sm:h-[330px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            ref={ringRef}
            className="absolute left-1/2 top-1/2 h-0 w-0"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            {slots.map((p, i) => (
              <div
                key={`${p.title}-${i}`}
                ref={(el) => {
                  cellRefs.current[i] = el;
                }}
                className="absolute"
                style={{
                  transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  width: 'clamp(150px, 22vw, 260px)',
                  marginLeft: 'calc(clamp(150px, 22vw, 260px) / -2)',
                  // Card is 4:3, so half its height is 0.375 × width.
                  marginTop: 'calc(clamp(150px, 22vw, 260px) * -0.375)',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    // Ignore the click that ends a drag.
                    if (drag.current.moved > 6) return;
                    onOpen?.(p);
                  }}
                  data-cursor="hover"
                  className="group block w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] transition-shadow duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={p.title}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      draggable={false}
                      loading="lazy"
                      className={`pixelated absolute inset-0 h-full w-full ${
                        p.contain ? 'bg-bg-soft object-contain p-3' : 'object-cover'
                      }`}
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Soft pool of light the ring appears to stand on */}
          <div
            className="pointer-events-none absolute left-1/2 top-[72%] h-14 w-[52%] -translate-x-1/2 rounded-[50%] blur-2xl"
            style={{
              background:
                'radial-gradient(ellipse at center, color-mix(in oklab, var(--color-accent) 26%, transparent), transparent 70%)',
            }}
          />
        </div>
      </div>
      </div>

      {/* Caption + controls */}
      <div className="mt-2 flex flex-col items-center gap-4">
        <div className="min-h-[3.5rem] max-w-md text-center" aria-live="polite">
          <p
            key={front.title}
            className="font-display text-lg font-semibold tracking-tight"
            style={{ animation: 'fade-up 0.45s cubic-bezier(0.22,1,0.36,1)' }}
          >
            {front.title}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            {front.tools.join(' · ')}
            {front.year ? ` · ${front.year}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => rotateBy(-1)}
            aria-label="Previous"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 hover:scale-110 hover:border-accent/60 hover:text-ink active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <span className="pixel-label text-[9px] text-muted">
            drag · hover to pause
          </span>

          <button
            onClick={() => rotateBy(1)}
            aria-label="Next"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 hover:scale-110 hover:border-accent/60 hover:text-ink active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
