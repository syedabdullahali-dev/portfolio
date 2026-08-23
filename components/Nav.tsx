'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { site } from '@/data/site';
import StackTicker from './StackTicker';

const links = [
  { href: '#skills', label: 'Skills' },
  { href: '#work', label: 'Work' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#pricing', label: 'Pricing' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = [...links.map((l) => l.href.slice(1)), 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 px-4 pt-4"
      >
        <nav
          className={clsx(
            'flex w-full max-w-3xl items-center gap-2 rounded-full px-3 py-2 transition-all duration-500',
            scrolled
              ? 'glass border border-line/80 shadow-[0_8px_40px_-12px_rgba(239,163,62,0.3)]'
              : 'border border-transparent'
          )}
        >
          <a
            href="#top"
            className="group flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold tracking-tight"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt=""
              className="pixelated relative h-8 w-8 rounded-lg border border-line shadow-lg shadow-accent/20 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
            />
            <span className="hidden sm:inline">{site.shortName}</span>
          </a>

          <div className="mx-auto hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors duration-300 hover:text-ink"
              >
                {active === l.href.slice(1) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-surface-2"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={clsx(
                    'relative z-10',
                    active === l.href.slice(1) && 'text-ink'
                  )}
                >
                  {l.label}
                </span>
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="ml-auto hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform duration-300 hover:scale-105 active:scale-95 md:block"
          >
            Let&apos;s talk
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="ml-auto flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-line md:hidden"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              className="block h-px w-4 bg-ink"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              className="block h-px w-4 bg-ink"
            />
          </button>
        </nav>

        {/* Tech-stack marquee — pauses on hover, tools link out, languages don't. */}
        <div
          className={clsx(
            'w-full max-w-3xl overflow-hidden rounded-2xl px-2 transition-all duration-500',
            scrolled
              ? 'glass border border-line/70 shadow-[0_8px_30px_-14px_rgba(239,163,62,0.35)]'
              : 'border border-transparent'
          )}
        >
          <StackTicker />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl md:hidden"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-full flex-col items-center justify-center gap-3">
              {[...links, { href: '#contact', label: 'Contact' }].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                  className="font-display text-3xl font-medium tracking-tight"
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
