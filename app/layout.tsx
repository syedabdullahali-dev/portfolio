import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces, Silkscreen } from 'next/font/google';
import './globals.css';
import { site } from '@/data/site';
import { SITE_URL } from '@/lib/site-url';
import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/Cursor';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Warm, soft-edged serif for headings — the cozy anchor of the type system.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

// Pixel face for small labels, nodding to the pixel-art work.
const silkscreen = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-silkscreen',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — Designer, Editor & Web Builder`,
    template: `%s · ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    'graphic designer',
    'video editor',
    'landing page developer',
    'brand identity',
    'Syed Abdullah Ali',
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} — Designer, Editor & Web Builder`,
    description: site.tagline,
    type: 'website',
    siteName: site.name,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: `${site.name} — Graphic Design, Video Editing, Landing Pages`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Designer, Editor & Web Builder`,
    description: site.tagline,
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#17120F',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${silkscreen.variable}`}>
      {/* Extensions such as Grammarly inject attributes into <body> before
          React loads, which otherwise reads as a hydration mismatch. */}
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
