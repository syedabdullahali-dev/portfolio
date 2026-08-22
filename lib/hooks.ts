'use client';

import { useEffect, useState } from 'react';

/** True once mounted on the client — guards anything that touches window. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Heavy visuals (WebGL, custom cursor) only run when this is true. */
export function useRichVisuals() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const finePointer = useMediaQuery('(pointer: fine)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return isDesktop && finePointer && !reduced;
}
