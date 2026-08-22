/** Turns a YouTube or Vimeo URL into an embeddable src + a poster image. */
export function parseVideoUrl(url?: string) {
  if (!url) return null;

  const yt =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    return {
      kind: 'youtube' as const,
      id: yt[1],
      embed: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1`,
      poster: `https://i.ytimg.com/vi/${yt[1]}/maxresdefault.jpg`,
    };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return {
      kind: 'vimeo' as const,
      id: vimeo[1],
      embed: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`,
      poster: `https://vumbnail.com/${vimeo[1]}.jpg`,
    };
  }

  return null;
}

/** Stable pseudo-random 0-1 from a string, so placeholders never reshuffle. */
export function seed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}
