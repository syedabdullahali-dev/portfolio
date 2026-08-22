'use client';

import { site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="relative border-t border-line px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5 text-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="pixelated h-8 w-8 rounded-lg border border-line"
          />
          <span className="text-muted">
            © {new Date().getFullYear()} {site.name}
          </span>
        </div>

        <div className="flex items-center gap-5 text-xs text-muted">
          <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
            Email
          </a>
          <a
            href={site.discord.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            Discord
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            LinkedIn
          </a>
        </div>

        <a
          href="#top"
          className="group flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs transition-all duration-300 hover:border-accent/60 hover:scale-105"
        >
          Back to top
          <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
            ↑
          </span>
        </a>
      </div>
    </footer>
  );
}
