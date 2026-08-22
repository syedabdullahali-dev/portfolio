'use client';

import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import { site } from '@/data/site';

const TagIcon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5 stroke-current">
    <path d="M3 12.5V4.5A1.5 1.5 0 014.5 3h8l8.5 8.5a1.5 1.5 0 010 2.1l-6.9 6.9a1.5 1.5 0 01-2.1 0L3 12.5z" strokeLinejoin="round" />
    <circle cx="7.8" cy="7.8" r="1.4" />
  </svg>
);

const BankIcon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5 stroke-current">
    <path d="M3 9.5L12 4l9 5.5" strokeLinejoin="round" />
    <path d="M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20h18" strokeLinecap="round" />
  </svg>
);

/**
 * Deliberately publishes no account details. Listing which methods are
 * accepted is useful; publishing the numbers themselves invites fraud and
 * fake-invoice scams, so those move to a private channel.
 */
const cards = [
  {
    key: 'pricing',
    icon: TagIcon,
    label: 'Pricing',
    accent: 'var(--color-accent)',
    body: "Every project is quoted on its own — there's no fixed rate card. Tell me your budget first and I'll shape the work to fit it, rather than send a number that ends the conversation.",
    points: ['Quoted per project, not per hour', 'Small servers and starting creators welcome'],
  },
  {
    key: 'payment',
    icon: BankIcon,
    label: 'Payment',
    accent: 'var(--color-accent2)',
    body: 'Bank transfer. I send the account details privately once we have agreed what I am making — never on a public page.',
    points: ['Price agreed before I start', 'No surprise costs at the end'],
  },
];

export default function Working() {
  return (
    <section id="pricing" className="relative mx-auto max-w-5xl scroll-mt-24 px-5 py-24 sm:py-28">
      <SectionHeading
        index="05"
        eyebrow="Working together"
        title="What it costs, and how it's paid."
        subtitle="No packages, no hidden extras. Just tell me what you need and what you can spend."
        align="center"
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.key} delay={i * 0.12}>
            <TiltCard strength={6} className="group h-full">
              <div className="grad-border relative flex h-full flex-col rounded-3xl border border-line bg-surface/60 p-7 transition-colors duration-500 hover:bg-surface">
                <div
                  className="pointer-events-none absolute -top-8 left-6 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
                  style={{ background: c.accent }}
                />

                <div className="relative flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-surface-2 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                    style={{ color: c.accent }}
                  >
                    {c.icon}
                  </span>
                  <span className="pixel-label text-[10px] text-muted">{c.label}</span>
                </div>

                <p className="relative mt-5 text-[15px] leading-relaxed text-muted">
                  {c.body}
                </p>

                <ul className="relative mt-6 space-y-2.5 border-t border-line pt-5">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm text-muted">
                      <span
                        className="h-1 w-1 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-150"
                        style={{ background: c.accent }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.28}>
        <p className="mt-8 text-center text-sm text-muted">
          Not sure what your project should cost?{' '}
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent('Budget question')}`}
            className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
          >
            Ask me — it&apos;s a free answer.
          </a>
        </p>
      </Reveal>
    </section>
  );
}
