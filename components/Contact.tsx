'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal, { RevealWords } from './Reveal';
import TiltCard from './TiltCard';
import { site } from '@/data/site';

const MailIcon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-5 w-5 stroke-current">
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
    <path d="M3 7l8.2 5.6a1.5 1.5 0 001.6 0L21 7" strokeLinecap="round" />
  </svg>
);

const DiscordIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M19.3 5.4A16.6 16.6 0 0015.2 4l-.3.5c1.4.3 2.6.9 3.7 1.6a12.6 12.6 0 00-10.7-.1c1-.7 2.2-1.2 3.5-1.5L11.1 4c-1.5.2-2.9.6-4.2 1.3C4.4 9 3.7 12.5 4 16a16.7 16.7 0 004.9 2.5l.9-1.4c-.8-.3-1.6-.7-2.2-1.2l.5-.4a11.9 11.9 0 0010.4 0l.5.4c-.7.5-1.4.9-2.2 1.2l.9 1.4A16.6 16.6 0 0022.5 16c.4-4-.7-7.5-3.2-10.6zM9.5 14c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8zm5 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8z" />
  </svg>
);

const GitHubIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.900 9.900 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.06 10.06 0 0022 12.25C22 6.58 17.52 2 12 2z" />
  </svg>
);

const LinkedInIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M6.2 8.9H3.1V21h3.1V8.9zM4.6 3a1.8 1.8 0 100 3.6A1.8 1.8 0 004.6 3zM21 13.7c0-3.2-1.7-4.7-4-4.7-1.8 0-2.7 1-3.1 1.7V8.9H10.8c0 .9 0 12.1 0 12.1h3.1v-6.8c0-.3 0-.6.1-.9.3-.7.9-1.4 1.9-1.4 1.3 0 1.9.9 1.9 2.4V21H21v-7.3z" />
  </svg>
);

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1900);
    } catch {
      // Clipboard blocked (insecure context / permissions) — the link still works.
    }
  };

  const cards = [
    {
      key: 'email',
      icon: MailIcon,
      label: 'Email',
      value: site.email,
      note: 'Best for briefs & quotes',
      accent: 'var(--color-accent)',
      href: `mailto:${site.email}?subject=${encodeURIComponent('Project enquiry')}`,
      action: 'Compose',
      copyValue: site.email,
    },
    {
      key: 'discord',
      icon: DiscordIcon,
      label: 'Discord',
      value: site.discord.username,
      note: 'Fastest for a quick chat',
      accent: 'var(--color-accent2)',
      href: site.discord.url,
      action: 'Open profile',
      copyValue: site.discord.username,
    },
    {
      key: 'github',
      icon: GitHubIcon,
      label: 'GitHub',
      value: 'syedabdullahali-dev',
      note: 'Code behind the builds',
      accent: 'var(--color-blush)',
      href: site.github,
      action: 'Follow me',
      copyValue: site.github,
    },
    {
      key: 'linkedin',
      icon: LinkedInIcon,
      label: 'LinkedIn',
      value: 'Syed Abdullah Ali',
      note: 'For the formal route',
      accent: 'var(--color-accent-soft)',
      href: site.linkedin,
      action: 'Connect',
      copyValue: site.linkedin,
    },
    // Phone card goes here when you're ready — same shape as the others.
  ];

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden px-5 py-28 sm:py-36"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[600px] opacity-40 blur-[120px]"
        style={{
          background:
            'radial-gradient(45% 55% at 50% 100%, var(--color-accent), transparent 70%), radial-gradient(35% 45% at 20% 90%, var(--color-accent2), transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-2.5">
            <span className="animate-float-soft inline-block text-accent2">♥</span>
            <span className="pixel-label text-[10px] text-muted">05 — Contact</span>
          </div>
        </Reveal>

        <h2 className="mt-6 font-display text-[clamp(2.2rem,7vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          <RevealWords text="Got something" />{' '}
          <span className="text-gradient">
            <RevealWords text="worth making?" delay={0.2} />
          </span>
        </h2>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-lg text-balance text-base leading-relaxed text-muted">
            Tell me what you&apos;re working on and roughly when you need it. I&apos;ll
            come back with a plan and a price — usually within twelve hours.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent('Project enquiry')}`}
            className="group relative mt-10 inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-accent to-accent2 px-8 py-4 text-sm font-semibold text-bg shadow-[0_16px_50px_-12px_rgba(239,163,62,0.6)] transition-transform duration-300 hover:scale-[1.04] active:scale-95"
          >
            <span className="relative z-10">Start a project</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
            <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-full" />
          </a>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.key} delay={0.12 * i}>
            <TiltCard strength={7} className="group h-full">
              <div className="grad-border relative flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-6 transition-colors duration-500 hover:bg-surface">
                <div
                  className="pointer-events-none absolute -top-8 right-6 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-50"
                  style={{ background: c.accent }}
                />

                <div className="relative flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-surface-2 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                    style={{ color: c.accent }}
                  >
                    {c.icon}
                  </span>
                  <span className="text-sm font-medium">{c.label}</span>
                </div>

                <p className="relative mt-5 break-all text-[13px] text-muted">{c.value}</p>
                <p className="relative mt-1 text-[11px] text-muted/70">{c.note}</p>

                <div className="relative mt-6 flex items-center gap-2 pt-1">
                  <a
                    href={c.href}
                    target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full border border-line bg-bg-soft px-3 py-2 text-center text-xs font-medium transition-all duration-300 hover:border-accent/60 hover:scale-[1.03] active:scale-95"
                  >
                    {c.action}
                  </a>
                  <button
                    onClick={() => copy(c.key, c.copyValue)}
                    aria-label={`Copy ${c.label}`}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 hover:border-accent/60 hover:text-ink hover:scale-110 active:scale-90"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied === c.key ? (
                        <motion.svg
                          key="tick"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5 stroke-emerald-400"
                        >
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </motion.svg>
                      ) : (
                        <motion.svg
                          key="copy"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.6"
                          className="h-3.5 w-3.5 stroke-current"
                        >
                          <rect x="9" y="9" width="11" height="11" rx="2.5" />
                          <path d="M5.5 15A2.5 2.5 0 014 12.8V6a2 2 0 012-2h6.8" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* Live region so the copy confirmation is announced, not just drawn. */}
      <p className="sr-only" role="status" aria-live="polite">
        {copied ? `${copied} copied to clipboard` : ''}
      </p>
    </section>
  );
}
