'use client';

import Reveal from './Reveal';
import { clients } from '@/data/site';

/**
 * A quiet band of real names. Worth more to a visitor than any adjective —
 * keep it honest: only add a name once work for them has actually shipped.
 */
export default function Clients() {
  return (
    <section className="relative px-5 py-6">
      <Reveal>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 rounded-3xl border border-line bg-surface/40 px-6 py-7 sm:flex-row sm:gap-8 sm:px-9">
          <span className="pixel-label shrink-0 text-[9px] text-accent">
            Worked with
          </span>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:justify-start">
            {clients.map((c) => (
              <li
                key={c}
                className="font-display text-[15px] tracking-tight text-muted transition-colors duration-300 hover:text-ink sm:text-base"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
