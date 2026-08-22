'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRichVisuals } from '@/lib/hooks';

type Sparkle = { id: number; x: number; y: number; hue: number; size: number };

const INTERACTIVE = 'a, button, [data-cursor="hover"], input, textarea';

export default function Cursor() {
  const rich = useRichVisuals();
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Two different spring weights give the dot/ring a bit of lag between them.
  const ringX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 1100, damping: 45 });
  const dotY = useSpring(y, { stiffness: 1100, damping: 45 });

  const lastSparkle = useRef(0);
  const sparkleId = useRef(0);

  useEffect(() => {
    if (!rich) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      // Sparkle trail — throttled so it stays a garnish, not a firework.
      const now = performance.now();
      if (now - lastSparkle.current > 110) {
        lastSparkle.current = now;
        const s: Sparkle = {
          id: sparkleId.current++,
          x: e.clientX + (Math.random() - 0.5) * 22,
          y: e.clientY + (Math.random() - 0.5) * 22,
          hue: Math.random() > 0.5 ? 262 : 188,
          size: 3 + Math.random() * 3,
        };
        setSparkles((prev) => [...prev.slice(-7), s]);
        window.setTimeout(
          () => setSparkles((prev) => prev.filter((p) => p.id !== s.id)),
          700
        );
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(Boolean(t?.closest?.(INTERACTIVE)));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    document.documentElement.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.documentElement.style.cursor = '';
    };
  }, [rich, x, y]);

  if (!rich) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          initial={{ opacity: 0.9, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2, y: -14 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            background: `hsl(${s.hue} 90% 72%)`,
            boxShadow: `0 0 8px hsl(${s.hue} 90% 65%)`,
          }}
        />
      ))}

      <motion.div
        className="absolute rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderColor: hovering
            ? 'color-mix(in oklab, var(--color-accent2) 80%, transparent)'
            : 'color-mix(in oklab, var(--color-accent) 70%, transparent)',
          backgroundColor: hovering
            ? 'color-mix(in oklab, var(--color-accent) 14%, transparent)'
            : 'transparent',
        }}
        animate={{
          width: hovering ? 52 : 30,
          height: hovering ? 52 : 30,
          opacity: pressed ? 0.55 : 1,
          scale: pressed ? 0.85 : 1,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      />

      <motion.div
        className="absolute h-[5px] w-[5px] rounded-full bg-accent"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: hovering ? 0 : 1 }}
      />
    </div>
  );
}
