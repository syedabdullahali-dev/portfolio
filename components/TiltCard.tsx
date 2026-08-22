'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import clsx from 'clsx';

/**
 * CSS-3D tilt with a specular highlight that tracks the pointer.
 * Falls back to a plain div on touch devices (no pointer to track).
 */
export default function TiltCard({
  children,
  className,
  strength = 9,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 260, damping: 22, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [strength, -strength]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-strength, strength]), spring);

  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div ref={ref} className="persp" onPointerMove={handleMove} onPointerLeave={reset}>
      <motion.div
        className={clsx('tilt-inner relative', className)}
        style={{ rotateX, rotateY }}
      >
        {children}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(340px circle at ${gx} ${gy}, color-mix(in oklab, var(--color-accent) 22%, transparent), transparent 60%)`
              ),
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
