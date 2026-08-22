'use client';

import { useEffect, useRef, useState } from 'react';
import { seed } from '@/lib/media';

/**
 * Fallback avatar, used when a reviewer has no photo assigned.
 *
 * Deliberately restrained: a warm gradient disc with the person's initials.
 * Earlier versions drew procedural pixel creatures, which read as noise at
 * 36px and clashed with the real photos sitting next to them.
 *
 * Hues are held inside the site's warm range so these sit alongside the
 * palette rather than fighting it.
 */
export default function PixelAvatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // An image that failed before hydration never fires onError — re-check.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (src && !failed) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        ref={imgRef}
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={className}
      />
    );
  }

  const s = seed(name);
  // 18°–52° keeps it in amber / copper / terracotta territory.
  const hue = 18 + Math.floor(s * 34);
  const id = `av${Math.floor(s * 100000)}`;

  const initials = name
    .split(/\s+/)
    .filter((w) => /^[a-z]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={name}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 52% 46%)`} />
          <stop offset="1" stopColor={`hsl(${(hue + 14) % 360} 44% 28%)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${id})`} />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-display"
        fontSize="42"
        fontWeight="600"
        fill="#F6EEE3"
        fillOpacity="0.92"
      >
        {initials || '·'}
      </text>
    </svg>
  );
}
