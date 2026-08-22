'use client';

import { motion, type MotionValue } from 'framer-motion';
import { status } from '@/data/site';

function Row({
  icon,
  label,
  value,
  accent,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line/80 bg-bg/50"
        style={{ color: accent }}
      >
        {icon}
        {children}
      </span>
      <span className="pixel-label shrink-0 text-[9px] text-muted">{label}</span>
      <span className="truncate text-[12.5px] text-ink/90">{value}</span>
    </div>
  );
}

export default function AboutCard({ imgY }: { imgY: MotionValue<string> }) {
  return (
    <div className="grad-border relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-surface">
      {/* Pixel art, kept crisp rather than smoothed */}
      <motion.div style={{ y: imgY }} className="absolute inset-[-6%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about-cat.webp"
          alt="Cozy pixel cat illustration"
          className="pixelated h-full w-full object-cover"
        />
      </motion.div>

      {/* Warm scrim so the panel stays readable over the art */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-transparent" />
      <div className="noise absolute inset-0" />

      {/* Floating greeting badge */}
      <div
        className="glass absolute right-5 top-5 flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-xs font-medium"
        style={{ transform: 'translateZ(45px)' }}
      >
        <span className="animate-float-soft inline-block">✿</span>
        Nice to meet you
      </div>

      {/* Status panel */}
      <div
        className="glass absolute inset-x-4 bottom-4 rounded-2xl border border-line p-4"
        style={{ transform: 'translateZ(55px)' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="pixel-label text-[9px] text-accent">Currently</span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inset-0 rounded-full bg-emerald-400"
                style={{ animation: 'pulse-ring 2.4s ease-out infinite' }}
              />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            online
          </span>
        </div>

        <div className="space-y-2.5">
          <Row
            accent="var(--color-accent)"
            label="now"
            value={status.now}
            icon={
              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden>
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            }
          />
          <Row
            accent="var(--color-accent2)"
            label="open"
            value={status.open}
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 stroke-current"
                fill="none"
                strokeWidth="2"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="4" width="18" height="16" rx="2.5" />
                <path d="M3 9h18" />
              </svg>
            }
          />
          <Row
            accent="var(--color-blush)"
            label="today"
            value={status.coffee}
            icon={
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 stroke-current"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 9h11v5a4 4 0 01-4 4H9a4 4 0 01-4-4V9z" />
                <path d="M16 10h2.2a2 2 0 010 4H16" />
              </svg>
            }
          >
            {/* wisp of steam */}
            <span
              className="pointer-events-none absolute -top-1 left-1/2 h-2 w-[2px] -translate-x-1/2 rounded-full bg-current opacity-0"
              style={{ animation: 'steam 3.2s ease-out infinite' }}
              aria-hidden
            />
          </Row>
        </div>
      </div>
    </div>
  );
}
