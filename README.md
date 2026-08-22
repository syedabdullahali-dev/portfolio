# Portfolio — Syed Abdullah Ali

Next.js 15 · Tailwind v4 · Framer Motion · raw WebGL hero

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npx vercel      # deploy
```

## Adding your work

Everything lives in **`data/projects.ts`**. Add an entry, save, done — the grid,
the filters and the lightbox all pick it up automatically.

```ts
{
  title: 'Aurora Skincare — Brand Identity',
  description: 'One line about what it was.',
  category: 'design',            // 'design' | 'video' | 'web'
  image: '/work/design/aurora.jpg',
  link: 'https://...',           // live site (web) or YouTube/Vimeo (video)
  tools: ['Illustrator', 'Photoshop'],
  featured: true,                // spans two columns
  year: '2025',
}
```

| Type | What to provide |
|---|---|
| **Design** | Drop the image in `public/work/design/` and point `image` at it. |
| **Video** | Put a YouTube or Vimeo URL in `link`. The thumbnail is pulled automatically, and clicking the card opens an embedded player. For a small clip (<10 MB) instead, put the file in `public/work/video/` and set `video: '/work/video/name.mp4'`. |
| **Web** | Put the live URL in `link` and a screenshot in `public/work/web/`. Clicking opens the site in a new tab. |

Any project with `image: ''` renders a generated gradient placeholder, so the
grid never looks broken while you're still collecting files.

## Asset pipeline

Raw source files live in **`assets-src/`**, which is NOT served. Only optimised
copies go in `public/` — that's why the deploy is ~780 KB instead of ~28 MB.
When you add a big PNG or a new avatar, run it through `sharp` into
`public/work/<category>/opt/` rather than dropping the original into `public/`.

## Other things you'll want to edit

- **`data/site.ts`** — name, tagline, email, Discord, LinkedIn. The phone field
  is there, commented out, for when you want it.
- **`data/reviews.ts`** — currently sample reviews written as placeholders.
  Replace with real client words as you collect them.
- **`data/stack.ts`** — the ticker under the nav. Items with an `href` become
  links that open in a new tab; languages deliberately have none. Add or remove
  freely — I only listed what your work actually evidences.
- **`data/site.ts`** — the `status` block drives the "Currently / now / open /
  today" panel on the About card.
- **`public/about-cat.webp`** — the art on the About card.
- **`public/logo.png`** — the pixel cat logo (also `app/icon.png` for the tab).
- **`components/Skills.tsx`** — the three pillars, their tool lists and the
  percentage rings.

## Notes

- The hero is a hand-written WebGL shader (~3 KB, no three.js). It is disabled
  automatically below 768 px, on touch-only devices, and when the visitor has
  "reduce motion" enabled — a CSS gradient stands in.
- The review columns pause when hovered. They ease to a stop rather than
  snapping, because velocity lerps toward zero instead of toggling
  `animation-play-state`.
- Colour tokens are defined once in `app/globals.css` under `@theme`.
