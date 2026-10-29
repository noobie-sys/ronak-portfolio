# Ronak Bisht portfolio

A static site. No build step: `index.html`, `css/`, `js/` and `assets/` are everything.

## Put it online (free, Netlify)
1. Go to https://app.netlify.com/drop and sign in (free).
2. Drag this whole `website` folder onto the page.
3. You get a link like `something.netlify.app`. Rename it in **Site configuration → Change site name**.
4. To update later: open the site in Netlify → **Deploys** → drag the folder again.

## Change the work
- Videos and designs live at the top of `js/main.js` in `VIDEOS` and `DESIGNS`.
  Each video needs three files in `assets/video/`: `id.mp4` (full, with sound), `id-loop.mp4` (6 s, silent) and `id-poster.jpg`.
- Archive folders are the `SETS` list in `js/main.js`.
- Desk sheets (music, gym, cricket, anime, about) are the `<template>` blocks at the bottom of `index.html`.
- After editing, bump `?v=20` in `index.html` and `js/main.js` so browsers fetch the new files.

## Sections
1. Hero: a laptop opens on every load; its screen holds the whole Mac desktop: menu bar, your name
   (hover, swipe or scroll over the letters for tool icons), folders and a dock that grows under the cursor.
   The page menu bar slides in once the laptop scrolls away.
2. Work: the 3D drum (Three.js). The middle card plays; click it to watch with sound. Videos / Designs switch below it.
3. Archive: folders that throw their pieces onto the table; drag them, click to open.
4. About: statement, tools, and a career timeline scrubbed by scroll.
5. Desk: hobbies, with bottom sheets (music, gym, cricket, anime, about).
6. Contact: copy email, Behance, footer.

Libraries load from CDNs: GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.14, Three.js 0.160.0, Google Fonts.
