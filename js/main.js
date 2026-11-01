// Ronak Bisht portfolio: interactions.
// Smooth scroll (Lenis) + GSAP ScrollTrigger drive the scene colours and reveals; the drum loads
// Three.js on demand, so a blocked CDN only costs the 3D, never the page.

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad = n => String(n).padStart(2, '0');
const EMAIL = 'ronakbisht84@gmail.com';
const { gsap, ScrollTrigger, Lenis } = window;

if (!gsap || !ScrollTrigger) html.classList.remove('boot');
window.__rbBoot = true; // tells the failsafe in index.html that the opening is handled here

/* ---------- Content ---------- */
const V = (id, title, meta) => ({
  type: 'video', id, title, meta,
  loop: `assets/video/${id}-loop.mp4`, poster: `assets/video/${id}-poster.jpg`, src: `assets/video/${id}.mp4`,
});
// Showcase designs: a full-size image for the viewer and a card cut to the drum's shape.
const W = (id, title, meta) => ({ type: 'image', id, img: `assets/img/work/${id}-card.jpg`, src: `assets/img/work/${id}.jpg`, title, meta });
// The showcase: Videos / Designs, each split into categories (Ronak's Drive folders, 1 Nov 2026).
// Every category is one list on the drum; `aspect` is the card shape for that list.
// A category with no items is left out of the chips, so Emailers shows up once it has some.
const WORK = {
  video: [
    { key: 'ai', label: 'AI reels', aspect: 9 / 16, items: [
      V('v01', 'Raftaar AI ad', 'Raftaar · 0:24'),
      V('v12', 'Five repos explainer', 'Voice-over + motion · 1:01'),
      V('v03', 'AI kitchen ad', 'Product ad · 0:32'),
      V('v05', 'Quotation hand-off explainer', 'Hinglish · 0:57'),
      V('v02', 'Raftaar crew ad', 'Raftaar · 0:30'),
      V('v11', 'Shopify to CRM explainer', 'Hinglish · 0:58'),
      V('v04', 'Saachi Realtors reel', 'Real estate · 0:17'),
    ] },
    { key: 'talking', label: 'Talking head', aspect: 9 / 16, items: [
      V('v08', 'Wardrobe stylist reel', 'Fashion · 1:14'),
      V('v18', 'Your style journey, ep. 1', 'Fashion series · 0:50'),
      V('v17', 'Dress with confidence', 'Fashion · 0:41'),
      V('v09', 'Styling tips reel', 'Fashion · 0:39'),
    ] },
    { key: 'motion', label: 'Motion graphics', aspect: 9 / 16, items: [
      V('v13', 'Raftaar cricket promo', 'Raftaar · 0:14'),
      V('v14', 'Rajdhani spices film', 'Rajdhani · 0:28'),
      V('v16', 'Too hot to step outside?', 'Raftaar · 0:20'),
      V('v15', 'Smart strategy explainer', 'The Night Marketer · 0:42'),
    ] },
    { key: 'edits', label: 'Edits', aspect: 9 / 16, items: [
      V('v19', 'Purpose from birth', 'Kinetic type · 0:24'),
      V('v21', 'Juice WRLD tribute', 'Music edit · 0:30'),
      V('v23', 'Getting sales feels', 'Ad edit · 0:18'),
      V('v22', 'ADHD podcast clip', 'Podcast edit · 0:17'),
      V('v07', 'Royale shoe unboxing', 'Product video · 0:22'),
      V('v20', 'Aap kon?', 'Collage edit · 0:09'),
      V('v10', 'Kinetic type edit', 'Short form · 0:23'),
      V('v06', 'Monk strap shoe film', 'Product video · 0:33'),
    ] },
  ],
  design: [
    { key: 'emailers', label: 'Emailers', aspect: 4 / 5, items: [] },
    { key: 'stories', label: 'Insta stories', aspect: 9 / 16, items: [
    W('st-01', 'Happy Bhai Dooj', 'Veda Connection'),
    W('st-02', 'Abhimanyu and Subhadra', 'Comic story · Veda Connection'),
    W('st-03', 'Ganesh shankh', 'Veda Connection'),
    W('st-04', 'Did you know?', 'Veda Connection'),
    W('st-05', 'Happy Makar Sankranti', 'Veda Connection'),
    W('st-06', 'The wheel of karma', 'Comic story · Veda Connection'),
    W('st-07', '7-day spiritual detox', 'Veda Connection'),
    W('st-08', 'Invite the Lord of Miracles', 'Veda Connection'),
    ] },
    { key: 'creatives', label: 'Creatives', aspect: 4 / 5, items: [
    W('cr-01', 'We make brands impossible to ignore', 'The Night Marketer'),
    W('cr-02', 'Eat clean, save time', 'FYB'),
    W('cr-03', 'Happy Holi', 'Raftaar'),
    W('cr-04', 'Aadiyogi Shiv idol ad', 'Veda Connection'),
    W('cr-05', 'Wild and wonderful sauces', 'Hot sauce launch'),
    W('cr-06', 'Dream wedding?', 'Wedding venue'),
    W('cr-07', 'Stuck? Go green', 'The Night Marketer'),
    W('cr-08', 'Happy Republic Day', 'Raftaar'),
    W('cr-09', 'Trick-or-treat your body', 'Halloween offer'),
    W('cr-10', 'Shri Lakshmi charan paduka', 'Veda Connection'),
    W('cr-11', 'Mild BBQ sauce', 'Product post'),
    W('cr-12', 'Your dream mandap', 'Wedding venue'),
    W('cr-13', 'Ads not working?', 'The Night Marketer'),
    W('cr-14', 'Black Friday', 'FYB'),
    W('cr-15', 'The heart of devotion', 'Veda Connection'),
    W('cr-16', 'Peace, framed by sunrise', 'Resort'),
    W('cr-17', 'Red Bull range', 'Raftaar'),
    W('cr-18', 'Gudi Padwa', 'Arjuna Estates'),
    W('cr-19', 'No tool fits?', 'The Night Marketer'),
    W('cr-20', 'Healthy meals, no cooking', 'FYB'),
    W('cr-21', 'Fast deliveries, faster lives', 'Raftaar'),
    W('cr-22', 'Mahashivratri', 'Veda Connection'),
    W('cr-23', 'Add heat, add flavour', 'Hot sauce'),
    W('cr-24', 'Unwind', 'Resort'),
    W('cr-25', 'Lead and sales toolkit', 'SaaS launch post'),
    W('cr-26', 'Eat clean without the effort', 'FYB'),
    W('cr-27', 'Ganesha shankh', 'Veda Connection'),
    W('cr-28', 'Memories', 'Wedding venue'),
    W('cr-29', 'Smooth shaves, easy days', 'Raftaar'),
    W('cr-30', 'Goddess Laxmi footprints', 'Veda Connection'),
    W('cr-31', 'Peace comes naturally', 'Resort'),
    W('cr-32', 'No time to cook?', 'FYB'),
    W('cr-33', 'Gold and silver Balaji', 'Veda Connection'),
    W('cr-34', 'Hanuman Ji murti', 'Veda Connection'),
    W('cr-35', 'Tranquility redefined', 'Resort'),
    ] },
    // On phones the banners go on the drum two to a card (bn-pair-N.jpg: two banner cards stacked), so they're big enough to read.
    { key: 'banners', label: 'Website banners', aspect: 2.4, stacked: ['bn-pair-1', 'bn-pair-2', 'bn-pair-3'], items: [
    W('bn-01', 'The ultimate sauce bundle', 'Maritime Madness'),
    W('bn-02', '390 L/hour pressure washer', 'Product banner'),
    W('bn-03', 'Fresh masala buttermilk', 'Product banner'),
    W('bn-04', 'Explore courses', 'Course website'),
    W('bn-05', 'Vacuum cleaner features', 'Product banner'),
    W('bn-06', 'Contact us', 'Course website'),
    ] },
  ],
};
for (const m in WORK) WORK[m] = WORK[m].filter(c => c.items.length);
const VIDEOS = WORK.video.flatMap(c => c.items);
const D = (file, title, meta, ratio) => ({ type: 'image', img: `assets/img/${file}`, src: `assets/img/${file}`, title, meta, ratio });
// The Archive folders' designs.
const DESIGNS = [
  D('design-fyb.jpg', 'FYB “Eat clean” ad', 'Ad creative · 1080 × 1080', 1),
  D('design-raftaar-delivery.jpg', 'Raftaar delivery post', 'Social post · 1080 × 1350', 0.8),
  D('design-raftaar-shave.jpg', 'Raftaar shaving post', 'Social post · 1254 × 1254', 1),
  D('design-bakeaway-bag.jpg', 'Bake a Way carry bags', 'Packaging · mockups', 1.5),
  D('design-bakeaway-dieline.jpg', 'Bake a Way dieline', 'Packaging · print file', 0.6),
];
const byId = id => VIDEOS.find(v => v.id === id);

/* ---------- Smooth scroll ---------- */
let lenis = null;
if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  if (!reduce && Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, touchMultiplier: 1.4 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(500, 33);
  }
}
function scrollToEl(target) {
  const el = typeof target === 'string' ? $(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}
let locks = 0;
function lock(on) {
  locks = Math.max(0, locks + (on ? 1 : -1));
  const locked = locks > 0;
  if (lenis) locked ? lenis.stop() : lenis.start();
  html.classList.toggle('locked', locked);
}

/* ---------- Small helpers: toast, cursor label, rolling letters ---------- */
const toast = $('#toast');
let toastTimer = 0;
function say(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

const cursor = $('#cursor');
let cursorHold = 0, dragWin = null;
function flash(text) {
  if (!fine) return;
  cursor.textContent = text;
  cursor.classList.add('on', 'done');
  cursorHold = performance.now() + 1100;
  setTimeout(() => cursor.classList.remove('done'), 1100);
}
if (fine) {
  document.addEventListener('pointermove', e => {
    cursor.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 18}px)`;
    if (performance.now() < cursorHold) return;
    const el = e.target.closest && e.target.closest('[data-cursor]');
    if (el && !dragWin && !e.target.closest('.stage-arrow')) { cursor.textContent = el.dataset.cursor; cursor.classList.add('on'); }
    else cursor.classList.remove('on');
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('on'));
}

$$('.roll').forEach(el => {
  const host = el.closest('a, button');
  if (host && !host.getAttribute('aria-label')) host.setAttribute('aria-label', host.textContent.trim());
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'rc';
    s.style.setProperty('--i', i);
    s.setAttribute('aria-hidden', 'true');
    const a = document.createElement('i'), b = document.createElement('i');
    a.textContent = b.textContent = c;
    s.append(a, b);
    el.append(s);
  });
});

/* ---------- Menu bar ---------- */
const bar = $('#bar'), barToggle = $('#barToggle');
const clockFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });
function tickClock() { const t = clockFmt.format(new Date()).replace(',', ''); $$('[data-clock]').forEach(e => { e.textContent = t; }); }
tickClock();
setInterval(tickClock, 20000);
$('#year').textContent = new Date().getFullYear();
function setMenu(open) {
  bar.classList.toggle('open', open);
  barToggle.setAttribute('aria-expanded', String(open));
  barToggle.textContent = open ? 'Close' : 'Menu';
}
barToggle.addEventListener('click', () => setMenu(!bar.classList.contains('open')));

$$('[data-copy]').forEach(b => b.addEventListener('click', () => {
  const done = () => { flash('Copied!'); say('Email copied: ' + EMAIL); };
  try { navigator.clipboard.writeText(EMAIL).then(done, () => say('Email: ' + EMAIL)); }
  catch (err) { say('Email: ' + EMAIL); }
  setMenu(false);
}));

/* ---------- Dock (inside the laptop screen): magnify like macOS, bounce on click ---------- */
const dock = $('#dock'), apps = $$('.app', dock);
function setHot(app) { apps.forEach(a => a.classList.toggle('hot', a === app)); }
if (fine && !reduce) {
  let rest = [];
  dock.addEventListener('pointerenter', () => {
    apps.forEach(a => a.style.setProperty('--s', 1));
    rest = apps.map(a => { const r = a.getBoundingClientRect(); return { c: r.left + r.width / 2, w: r.width }; });
  });
  dock.addEventListener('pointermove', e => {
    if (!rest.length) return;
    let best = null, bestD = Infinity;
    apps.forEach((a, i) => {
      const d = Math.abs(e.clientX - rest[i].c);
      const t = Math.min(1, d / (rest[i].w * 2.5));
      a.style.setProperty('--s', (1 + 0.62 * (Math.cos(t * Math.PI) + 1) / 2).toFixed(3));
      if (d < bestD) { bestD = d; best = a; }
    });
    setHot(best);
  });
  dock.addEventListener('pointerleave', () => { apps.forEach(a => a.style.setProperty('--s', 1)); setHot(null); rest = []; });
} else {
  apps.forEach(a => { a.addEventListener('pointerenter', () => setHot(a)); a.addEventListener('pointerleave', () => setHot(null)); });
}
/* Every [data-go] link scrolls to its section; dock icons bounce first, like an app opening. */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-go]');
  if (!a) return;
  e.preventDefault();
  setMenu(false);
  const inSheet = !!a.closest('.sheet');
  if (inSheet) closeSheet();
  const go = () => {
    if (a.dataset.mode) setMode(a.dataset.mode);
    scrollToEl(a.dataset.go);
    if (a.dataset.sheet) setTimeout(() => openSheet(a.dataset.sheet), lenis ? 1450 : 700);
  };
  if (a.classList.contains('app') && !reduce) {
    a.classList.remove('bounce');
    void a.offsetWidth;
    a.classList.add('bounce');
    setTimeout(go, 520);
  } else setTimeout(go, inSheet ? 300 : 0);
});

/* ---------- Desktop icons (inside the laptop screen): drag them around like on a Mac; a plain click still opens ---------- */
// Mouse only, so a finger on a phone still scrolls the page. They stay inside the screen, below its menu bar.
const wall = $('#wall');
$$('.d-icon').forEach(icon => {
  let drag = null, x = 0, y = 0, dragged = false;
  icon.addEventListener('dragstart', e => e.preventDefault()); // links are natively draggable
  icon.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const wb = wall.getBoundingClientRect(), ib = icon.getBoundingClientRect();
    const k = wb.width / wall.offsetWidth; // the laptop is scaled by the opening and the scroll tilt
    const top = wb.top + $('.mb', wall).offsetHeight * k;
    drag = { sx: e.clientX, sy: e.clientY, k, x0: x, y0: y,
      minX: (wb.left - ib.left) / k, maxX: (wb.right - ib.right) / k, minY: (top - ib.top) / k, maxY: (wb.bottom - ib.bottom) / k };
    dragged = false;
    icon.setPointerCapture(e.pointerId);
  });
  icon.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = (e.clientX - drag.sx) / drag.k, dy = (e.clientY - drag.sy) / drag.k;
    if (!dragged && Math.hypot(dx, dy) < 5) return;
    dragged = true;
    icon.classList.add('dragging');
    x = drag.x0 + clamp(dx, drag.minX, drag.maxX);
    y = drag.y0 + clamp(dy, drag.minY, drag.maxY);
    icon.style.translate = `${x}px ${y}px`;
  });
  const drop = () => { drag = null; icon.classList.remove('dragging'); };
  icon.addEventListener('pointerup', drop);
  icon.addEventListener('pointercancel', drop);
  // A drag ends in a click on the same icon; swallow it so dropping an icon doesn't scroll the page.
  icon.addEventListener('click', e => { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);
});

/* ---------- Letters: split, lock widths, swap for tool icons on hover ---------- */
function split(el) {
  const text = el.textContent;
  el.textContent = '';
  text.split(' ').forEach((word, wi, arr) => {
    const w = document.createElement('span');
    w.className = 'w';
    [...word].forEach(c => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      s.setAttribute('aria-hidden', 'true');
      w.appendChild(s);
    });
    el.appendChild(w);
    if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
  });
  return $$('.ch', el);
}
function lockWidths(chars) { chars.forEach(c => { c.style.width = ''; }); chars.forEach(c => { c.style.width = c.offsetWidth + 'px'; }); }
function relock(chars, keep) {
  const k = chars[keep], had = k.classList.contains('swap');
  k.classList.remove('swap');
  lockWidths(chars);
  if (had) k.classList.add('swap');
}
const ICONS = ['🎬', '🎥', '🎧', '📱', '🎨', '✂️', '🎞️', '💻', '📸', '🖌️', '✏️', '🎙️', '💡', '⚡️', '💙'];
let lastIcon = -1;
function nextIcon() { let i; do { i = Math.floor(Math.random() * ICONS.length); } while (i === lastIcon); lastIcon = i; return ICONS[i]; }
const iconTimers = new Map();
function swapIcon(ch) {
  clearTimeout(iconTimers.get(ch));
  if (!ch.classList.contains('icon')) {
    ch.classList.remove('pop');
    ch.dataset.icon = nextIcon();
    ch.style.setProperty('--r', (Math.random() * 30 - 15).toFixed(1) + 'deg');
    ch.classList.add('icon');
  }
  iconTimers.set(ch, setTimeout(() => { ch.classList.remove('icon'); ch.classList.add('pop'); }, 750));
}
let rippling = false;
function ripple(chars, keep) {
  if (rippling) return;
  rippling = true;
  chars.forEach((ch, i) => { if (i !== keep) setTimeout(() => swapIcon(ch), i * 70); });
  setTimeout(() => { rippling = false; }, chars.length * 70 + 600);
}
// Hover a letter (mouse), drag a finger across the name (touch), or scroll over it (ripple).
function iconHover(host, chars, keep) {
  chars.forEach((ch, i) => ch.addEventListener('pointerenter', () => { if (i !== keep) swapIcon(ch); }));
  const under = e => {
    if (e.pointerType === 'mouse') return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const ch = el && el.closest && el.closest('.ch');
    const i = chars.indexOf(ch);
    if (i >= 0 && i !== keep) swapIcon(ch);
  };
  host.addEventListener('pointerdown', under);
  host.addEventListener('pointermove', under);
  host.addEventListener('wheel', () => ripple(chars, keep), { passive: true });
}
const KEEP = 3; // the blue italic a, from the G in your Behance banner
const heroName = $('#heroName');
const heroChars = split(heroName);
iconHover(heroName, heroChars, KEEP);
addEventListener('resize', () => relock(heroChars, KEEP));

/* ---------- Hero: the page loads on a shut laptop under a headline; the first scroll opens it by itself ---------- */
let dockIn = null, woke = false, opened = false;
// Once the lid is nearly open the screen wakes up: menu bar, name, tags and icons, then the dock. Plays once.
function wakeDesktop() {
  if (woke) return;
  woke = true;
  dockIn.play();
  gsap.timeline()
    .to('.mb', { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 0)
    .to(heroChars, { autoAlpha: 1, duration: 0.01, stagger: 0.05 }, 0.05)
    .to('.hero-content .hero-tags, .hero-sub, .hero-content .hero-line, .desk-icons, .hero-below > *', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 }, 0.3)
    .add(() => { heroChars[KEEP].classList.remove('swap'); void heroChars[KEEP].offsetWidth; heroChars[KEEP].classList.add('swap'); }, 0.05 + heroChars.length * 0.05 + 0.05)
    .add(() => ripple(heroChars, KEEP), 1.45);
}
function setupLaptop() {
  const cam = $('#cam'), lid = $('#lid'), power = $('#power'), intro = $('#intro');
  if (!gsap || !ScrollTrigger) { html.classList.remove('boot'); return; }
  // Take over from the CSS closed state: close up, looking down on a shut laptop.
  // With Reduce Motion on, the camera stays still and only the lid opens.
  if (reduce) gsap.set(cam, { x: 0, y: 0, yPercent: 0, scale: 1, rotationX: 0 });
  else gsap.set(cam, { x: 0, y: 0, yPercent: -18, scale: 1.12, rotationX: -46, transformOrigin: '50% 60%' });
  gsap.set(lid, { rotationX: -89, transformOrigin: '50% 100%' });
  gsap.set(power, { autoAlpha: 1 });
  gsap.set(heroChars, { autoAlpha: 0 });
  gsap.set('.mb', { yPercent: -100 });
  gsap.set('.desk-icons, .hero-content .hero-tags, .hero-sub, .hero-content .hero-line, .hero-below > *', { autoAlpha: 0, y: 10 });
  // WAAPI on transform only, so the dock's centring (the CSS translate property) is never touched.
  dockIn = dock.animate([{ transform: 'translateY(170%)' }, { transform: 'none' }], { duration: 750, delay: 250, easing: 'cubic-bezier(.34,1.4,.64,1)', fill: 'backwards' });
  dockIn.pause();
  intro.classList.add('on'); // its entrance is a CSS animation
  html.classList.remove('boot');
  // The first nudge down (wheel, swipe, arrow key) is caught at the top of the page and plays the opening by
  // itself (Ronak's request: visitors shouldn't have to scroll it open): the headline drifts away, the camera
  // swings down to eye level and the lid lifts. The page holds still until the lid is open, then scrolls normally.
  const open = gsap.timeline({ paused: true, onComplete: () => held && lock(false) })
    .to(intro, { yPercent: -30, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, 0)
    .to('.scroll-cue', { autoAlpha: 0, duration: 0.3 }, 0)
    .to(cam, { yPercent: 0, scale: 1, rotationX: 0, duration: reduce ? 0 : 1.9, ease: 'power3.inOut' }, 0.1)
    .to(lid, { rotationX: 0, duration: 1.3, ease: 'power2.inOut' }, 0.45)
    .to(power, { autoAlpha: 0, duration: 0.35 }, 1.5)
    .add(wakeDesktop, 1.55);
  let held = false;
  const play = hold => {
    if (opened) return;
    opened = true;
    held = hold;
    if (hold) lock(true);
    open.play();
  };
  const atTop = () => scrollY < 4;
  // Capture phase on window, so Lenis never sees the nudge that opens the laptop.
  addEventListener('wheel', e => {
    if (!opened && atTop() && e.deltaY > 0) { e.preventDefault(); e.stopImmediatePropagation(); play(true); }
  }, { capture: true, passive: false });
  let touchY = 0;
  addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchmove', e => {
    if (!opened && atTop() && touchY - e.touches[0].clientY > 6) { e.preventDefault(); play(true); }
  }, { passive: false });
  addEventListener('keydown', e => {
    if (opened || !atTop() || !['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)) return;
    if (e.target.closest && e.target.closest('a, button, input, textarea, [tabindex]')) return;
    e.preventDefault();
    play(true);
  });
  // Anything else that moves the page (a menu link, the scrollbar, a reload halfway down) opens it without holding.
  addEventListener('scroll', () => { if (!opened && !atTop()) play(false); }, { passive: true });
}
setupLaptop();
document.fonts.ready.then(() => {
  lockWidths(heroChars);
  heroChars[KEEP].classList.add('swap');
  ScrollTrigger && ScrollTrigger.refresh();
});

/* ---------- Scroll: scene colours, active section, hero exit, reveals ---------- */
function splitWords(el) {
  const out = [];
  [...el.childNodes].forEach(node => {
    if (node.nodeType === 3) {
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { el.insertBefore(document.createTextNode(part), node); return; }
        const w = document.createElement('span');
        w.className = 'w';
        w.textContent = part;
        el.insertBefore(w, node);
        out.push(w);
      });
      node.remove();
    } else if (node.nodeType === 1) {
      const w = document.createElement('span');
      w.className = 'w';
      el.insertBefore(w, node);
      w.appendChild(node);
      out.push(w);
    }
  });
  return out;
}
function setActive(id) {
  $$('[data-sec]').forEach(a => a.classList.toggle('on', a.dataset.sec === id));
}
if (gsap && ScrollTrigger) {
  $$('section[data-scene]').forEach(sec => ScrollTrigger.create({
    trigger: sec, start: 'top 55%', end: 'bottom 55%',
    onToggle: s => { if (s.isActive) { document.body.dataset.scene = sec.dataset.scene; setActive(sec.id); } },
  }));
  if (!reduce) {
    // As you scroll on past the open laptop, it tips back and shrinks away.
    gsap.timeline({ scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true } })
      .to('#laptop', { scale: 0.86, rotationX: 16, yPercent: -6, ease: 'none' }, 0)
      .to('.hero-below', { autoAlpha: 0, ease: 'none' }, 0);
    $$('.split').forEach(el => {
      const words = splitWords(el);
      gsap.from(words, { yPercent: 45, autoAlpha: 0, duration: 0.75, ease: 'power3.out', stagger: 0.045, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });
    $$('.rv').forEach(el => gsap.from(el, { y: 40, autoAlpha: 0, duration: 0.95, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
    gsap.from('.c-row', { yPercent: 40, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.c-rows', start: 'top 85%', once: true } });
    gsap.from('.foot-big', { yPercent: 30, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.foot-big', start: 'top 95%', once: true } });
  }
}

/* ---------- About: the desk's hotspots and the bottom sheet ---------- */
// Hovering an object lights its box (the lit copy of the picture is clipped to it); hovering Ronak turns him round;
// hovering a drawer swaps in the picture with the drawers open, and he turns round to say something about it.
const room = $('#room'), roomLit = $('#roomLit'), roomSay = $('#roomSay'), spots = $$('.spot', room);
const sheetLayer = $('#sheetLayer'), sheetBody = $('#sheetBody');
let sheetOpen = false, sheetReturn = null, quipSpot = null;
function setOn(spot) {
  spots.forEach(s => s.classList.toggle('on', s === spot));
  room.classList.toggle('has-on', !!spot);
  room.classList.toggle('turned', !!spot && spot.classList.contains('me'));
  const say = spot && spot.dataset.say;
  room.classList.toggle('open', !!say);
  if (say) roomSay.innerHTML = say; // our own markup from data-say; the old line stays while the bubble fades out
  if (spot) ['--l', '--t', '--w', '--h'].forEach(k => roomLit.style.setProperty(k, spot.style.getPropertyValue(k)));
  // The laptop has a different "no peeking" line every time you look at it.
  if (spot && spot.dataset.quips && spot !== quipSpot) {
    const quips = spot.dataset.quips.split('|');
    spot._q = ((spot._q ?? -1) + 1) % quips.length;
    $('.pill', spot).textContent = quips[spot._q];
  }
  quipSpot = spot;
}
function openSheet(name) {
  const t = document.getElementById('t-' + name);
  if (!t) return;
  sheetBody.replaceChildren(t.content.cloneNode(true));
  const np = $('.np-name', sheetBody);
  $$('.artist', sheetBody).forEach(a => {
    const pick = () => { $$('.artist', sheetBody).forEach(x => x.classList.toggle('playing', x === a)); if (np) np.textContent = a.dataset.name; };
    a.addEventListener('click', e => { if (!e.target.closest('a')) pick(); });
    a.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
  sheetReturn = document.activeElement;
  $('.sheet', sheetLayer).scrollTop = 0;
  sheetLayer.classList.add('open');
  sheetLayer.setAttribute('aria-hidden', 'false');
  if (!sheetOpen) lock(true);
  sheetOpen = true;
  setTimeout(() => $('.sheet-close', sheetLayer).focus({ preventScroll: true }), 60);
}
function closeSheet() {
  if (!sheetOpen) return;
  sheetOpen = false;
  sheetLayer.classList.remove('open');
  sheetLayer.setAttribute('aria-hidden', 'true');
  lock(false);
  setOn(null);
  if (sheetReturn && sheetReturn.focus) sheetReturn.focus({ preventScroll: true });
}
sheetLayer.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSheet(); });
spots.forEach(spot => {
  if (fine) {
    spot.addEventListener('pointerenter', () => setOn(spot));
    spot.addEventListener('pointerleave', () => { if (!sheetOpen) setOn(null); });
  }
  spot.addEventListener('focus', () => setOn(spot));
  spot.addEventListener('blur', () => { if (!sheetOpen) setOn(null); });
  spot.addEventListener('click', () => {
    setOn(spot);
    openSheet(spot.dataset.sheet);
    // Objects with nothing to open (the plant, the controller) just show their label for a moment on touch.
    clearTimeout(room._t);
    if (!fine && !spot.dataset.sheet) room._t = setTimeout(() => setOn(null), 1600);
  });
});

/* ---------- Work: the drum ---------- */
const stage = $('#stage'), seg = $('#seg'), segPill = $('#segPill');
const chips = $('#chips');
let drum = null, drumState = 'idle', mode = 'video', fallback = null;
// The chosen category for each mode, remembered when the visitor flips between Videos and Designs.
const pick = { video: WORK.video[0].key, design: WORK.design[0].key };
const currentCat = () => WORK[mode].find(c => c.key === pick[mode]);
const currentList = () => currentCat().items;
// What actually goes on the drum: the list itself, or on a phone the banners stacked two to a card.
const phoneMQ = matchMedia('(max-width: 699px)');
const stacked = () => phoneMQ.matches && currentCat().stacked;
const drumItems = () => (stacked()
  ? currentCat().stacked.map((f, k) => ({ type: 'image', img: `assets/img/work/${f}.jpg`, pair: currentList().slice(k * 2, k * 2 + 2) }))
  : currentList());
const drumAspect = () => (stacked() ? 1440 / 1248 : currentCat().aspect);
function caption(i, item) {
  const total = pad(currentList().length);
  if (item.pair) {
    const [a, b] = item.pair;
    $('#dIdx').textContent = `${pad(i * 2 + 1)}–${pad(i * 2 + item.pair.length)} / ${total}`;
    $('#dTitle').textContent = a.title;
    $('#dMeta').textContent = b ? `+ ${b.title}` : a.meta;
    return;
  }
  $('#dIdx').textContent = `${pad(i + 1)} / ${total}`;
  $('#dTitle').textContent = item.title;
  $('#dMeta').textContent = item.meta;
}
// A tap on a stacked card opens the banner it landed on (top or bottom half).
function openFromDrum(i, item, y) {
  openViewer(currentList(), item && item.pair ? i * 2 + (y > 0.5 && item.pair[1] ? 1 : 0) : i);
}
function buildFallback() {
  if (!fallback) {
    fallback = document.createElement('div');
    fallback.className = 'fallback-row';
    stage.replaceWith(fallback);
  }
  fallback.style.setProperty('--ar', currentCat().aspect);
  fallback.classList.toggle('wide', currentCat().aspect > 1);
  fallback.replaceChildren(...currentList().map((it, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Open ' + it.title);
    const img = new Image();
    img.src = it.poster || it.img;
    img.alt = '';
    img.loading = 'lazy';
    b.append(img);
    b.addEventListener('click', () => openViewer(currentList(), i));
    return b;
  }));
}
async function initDrum() {
  if (drumState !== 'idle') return;
  drumState = 'loading';
  try {
    const mod = await import('./drum.js?v=45');
    drum = mod.createDrum(stage, {
      items: drumItems(), aspect: drumAspect(), bg: '#07182f', reduce,
      onChange: caption,
      onOpen: openFromDrum,
      onCursor: label => { stage.dataset.cursor = label || 'Drag'; },
    });
  } catch (err) {
    drum = null;
  }
  drumState = 'ready';
  if (!drum) buildFallback();
}
// Load the 3D drum as the visitor nears it, or once the page has settled, whichever comes first.
new IntersectionObserver((entries, io) => {
  if (entries.some(en => en.isIntersecting)) { io.disconnect(); initDrum(); }
}, { rootMargin: '900px 0px' }).observe(stage);
if (ScrollTrigger) ScrollTrigger.create({ trigger: stage, start: 'top bottom+=900', once: true, onEnter: initDrum });
setTimeout(initDrum, 4000);
$('#dPrev').addEventListener('click', () => drum && drum.go(-1));
$('#dNext').addEventListener('click', () => drum && drum.go(1));

// Slide a toggle's pill under its chosen button. Both rows (Videos / Designs and the categories) use it.
function placePill(pill, btn, animate) {
  const left = btn.offsetLeft, width = btn.offsetWidth;
  const prevLeft = parseFloat(pill.style.left || left);
  const right = left > prevLeft;
  if (!animate || reduce) {
    pill.style.transition = 'none';
    pill.style.left = left + 'px';
    pill.style.width = width + 'px';
    return;
  }
  // The leading edge moves first and the trailing edge catches up, so the pill stretches.
  pill.style.transition = right
    ? 'width .38s cubic-bezier(.34,1.3,.64,1), left .4s cubic-bezier(.34,1.3,.64,1) .055s'
    : 'left .38s cubic-bezier(.34,1.56,.64,1), width .4s cubic-bezier(.34,1.3,.64,1) .055s';
  if (right) {
    pill.style.width = left + width - prevLeft + 'px';
    setTimeout(() => { pill.style.left = left + 'px'; pill.style.width = width + 'px'; }, 110);
  } else {
    pill.style.left = left + 'px';
    pill.style.width = width + 'px';
  }
}
const chipPill = $('#chipPill');
const placeChip = animate => {
  const b = $('[aria-selected="true"]', chips);
  if (!b) return;
  placePill(chipPill, b, animate);
  // On a phone the row can scroll sideways; keep the chosen one in view.
  if (chips.scrollWidth > chips.clientWidth) chips.scrollTo({ left: b.offsetLeft - (chips.clientWidth - b.offsetWidth) / 2, behavior: animate && !reduce ? 'smooth' : 'auto' });
};
// Put the current category on the drum (or the flat row when there's no WebGL).
function showList() {
  caption(0, drumItems()[0]);
  if (drum) drum.setItems(drumItems(), drumAspect());
  else if (fallback) buildFallback();
}
// The second row: a sliding toggle with one button per category of the current mode, and how many pieces it holds.
function buildChips(animate) {
  chips.replaceChildren(chipPill, ...WORK[mode].map(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.dataset.cat = c.key;
    b.setAttribute('aria-selected', String(c.key === pick[mode]));
    b.innerHTML = `${c.label}<span>${c.items.length}</span>`;
    return b;
  }));
  chipPill.style.left = '';
  placeChip(false);
  if (animate && !reduce) chips.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' });
}
function setCat(key) {
  if (key === pick[mode]) return;
  pick[mode] = key;
  $$('button', chips).forEach(b => b.setAttribute('aria-selected', String(b.dataset.cat === key)));
  placeChip(true);
  showList();
}
function setMode(m) {
  if (m === mode) return;
  mode = m;
  const btn = $(`[data-mode="${m}"]`, seg);
  $$('button', seg).forEach(x => x.setAttribute('aria-selected', String(x === btn)));
  placePill(segPill, btn, true);
  buildChips(true);
  showList();
}
seg.addEventListener('click', e => { const b = e.target.closest('button[data-mode]'); if (b) setMode(b.dataset.mode); });
chips.addEventListener('click', e => { const b = e.target.closest('button[data-cat]'); if (b) setCat(b.dataset.cat); });
buildChips(false);
caption(0, drumItems()[0]);
// Turning a phone sideways (or resizing) swaps the banners between stacked and single.
phoneMQ.addEventListener('change', () => { if (currentCat().stacked) showList(); });
const placeBoth = () => { placePill(segPill, $('[aria-selected="true"]', seg), false); placeChip(false); };
document.fonts.ready.then(placeBoth);
addEventListener('resize', placeBoth);

/* ---------- Archive: folders that throw their contents onto the table ---------- */
const arch = $('#arch'), archHint = $('#archHint');
// What each folder holds (1 Nov 2026, from his résumé): his tools, and the brands he's made work for.
// Clicking a tool card opens a piece made with it; clicking a brand card opens all of that brand's work.
const ALL = [...VIDEOS, ...WORK.design.flatMap(c => c.items)];
const piece = id => ALL.find(it => it.id === id);
const T = (badge, name, line, sample) => ({ type: 'tool', badge: `assets/img/tools/${badge}.svg`, name, line, sample: sample && piece(sample) });
const TOOLS = [
  T('ps', 'Photoshop', 'Social creatives, ads, thumbnails', 'cr-02'),
  T('ai', 'Illustrator', 'Brand assets, packaging, vectors', null),
  T('pr', 'Premiere Pro', 'Short & long-form edits, captions, sound design', 'v08'),
  T('ae', 'After Effects', 'Motion graphics, transitions, VFX', 'v15'),
  T('id', 'InDesign', 'Print catalogues and layouts', null),
  T('csp', 'Clip Studio Paint', 'Illustrations and comic stories', 'st-02'),
  T('chatgpt', 'ChatGPT', 'Ideas, scripts and captions', null),
  T('claude', 'Claude', 'Scripts, briefs and planning', null),
  T('gemini', 'Gemini', 'Research and AI visuals', null),
  T('elevenlabs', 'ElevenLabs', 'AI voice-overs', null),
];
TOOLS[1].sample = DESIGNS[4]; // Illustrator: the Bake a Way dieline
// Brands he picked (1 Nov). `logo` is his file in assets/img/brands/; without one the card shows the name as a wordmark.
// A brand with no pieces on the site (Studio Audela) is a card that opens nothing.
const B = (name, logo, sub, items) => ({ type: 'brand', ratio: 0.72, name, logo: logo && `assets/img/brands/${logo}`, items, sub: sub || `${items.length} ${items.length === 1 ? 'piece' : 'pieces'}` });
const ids = list => list.map(piece);
const BRANDS = [
  B('The Night Marketer', 'tnm.png', 'Where I work · 2025–now', ids(['cr-01', 'v15', 'cr-07', 'cr-13', 'cr-19'])),
  B('Raftaar', 'raftaar.jpg', null, ids(['cr-03', 'v01', 'cr-08', 'v13', 'cr-17', 'v02', 'cr-21', 'v16', 'cr-29'])),
  B('Veda Connection', 'veda.png', 'Internship · 2024–25', ids(['cr-04', 'st-02', 'cr-15', 'st-01', 'cr-10', 'st-06', 'cr-22', 'st-03', 'cr-27', 'st-04', 'cr-30', 'st-05', 'cr-33', 'st-07', 'cr-34', 'st-08'])),
  B('Fuel Your Body', 'fyb.jpg', null, ids(['cr-02', 'cr-14', 'cr-20', 'cr-26', 'cr-32'])),
  B('Studio Audela', 'audela.png', 'Agency', []),
  B('Bake a Way', 'bakeaway.jpg', null, [DESIGNS[4], DESIGNS[3]]),
  B('Rajdhani', null, null, ids(['v14'])),
];
const SETS = { toolkit: TOOLS, brands: BRANDS };
const folders = $$('.folder', arch);
let openSet = null, openBtn = null, wins = [], z = 10;
function centreOf(btn) {
  const a = arch.getBoundingClientRect(), f = btn.getBoundingClientRect();
  return { x: f.left - a.left + f.width / 2, y: f.top - a.top + f.height / 2 };
}
function labelFolder(btn, isOpen) {
  btn.setAttribute('aria-expanded', String(isOpen));
  btn.setAttribute('aria-label', `${btn.dataset.name}. ${isOpen ? 'Close it.' : 'Open it.'}`);
}
function openArchive(btn) {
  openSet = btn.dataset.set;
  openBtn = btn;
  labelFolder(btn, true);
  archHint.hidden = false;
  const W = arch.clientWidth, H = arch.clientHeight, c = centreOf(btn), a = arch.getBoundingClientRect();
  const fTop = btn.getBoundingClientRect().top - a.top, fH = btn.offsetHeight;
  const labelBottom = btn.parentElement.getBoundingClientRect().bottom - a.top;
  const base = Math.min(200, Math.max(100, W * 0.16));
  const list = SETS[openSet];
  const sizes = list.map(item => {
    const ratio = item.type === 'video' ? 9 / 16 : item.ratio || 0.8;
    const area = base * base * (ratio > 1.2 ? 1.25 : ratio < 0.7 ? 0.9 : 1) * (item.type === 'tool' ? 0.72 : item.type === 'brand' ? 0.78 : 1);
    const w = Math.sqrt(area * ratio);
    return { w, h: w / ratio };
  });
  // Balanced rows (up to 7 a row, 4 on a phone), bottoms lined up in each row, the block tucked just into the
  // folder's back so the cards look like they came out of it. Shrunk to fit the table's width and the room above
  // the folder; if there's more room under it (phones, or a folder dragged to the top), the block goes under.
  // Brand circles have their names underneath, so they stop just above the folder instead of tucking into it.
  const gap = Math.max(10, base * 0.08), dip = list[0].type === 'brand' ? -14 : 0.15 * fH;
  const nRows = Math.ceil(list.length / (W < 600 ? 4 : 7)), per = Math.ceil(list.length / nRows);
  const rows = Array.from({ length: nRows }, (_, r) => sizes.slice(r * per, r * per + per));
  const rowWs = rows.map(rw => rw.reduce((sum, p) => sum + p.w, 0) + gap * (rw.length - 1));
  const rowHs = rows.map(rw => Math.max(...rw.map(p => p.h)));
  const blockW = Math.max(...rowWs), blockH = rowHs.reduce((sum, h) => sum + h, 0) + gap * (nRows - 1);
  const roomAbove = fTop + dip - 12, roomBelow = H - labelBottom - 24;
  const goAbove = roomAbove >= Math.min(blockH * 0.75, roomBelow);
  const k = Math.min(1, (W - 20) / blockW, (goAbove ? roomAbove : roomBelow) / blockH);
  const spots = [];
  let rowTop = goAbove ? fTop + dip - blockH * k : labelBottom + 12;
  const blockLeft = clamp(c.x - blockW * k / 2, 10, W - 10 - blockW * k);
  rows.forEach((rw, r) => {
    let left = blockLeft + (blockW - rowWs[r]) * k / 2; // a shorter last row sits centred under the others
    rw.forEach(p => {
      const w = p.w * k, h = p.h * k;
      spots.push({ w, h, x: left + w / 2, y: rowTop + rowHs[r] * k - h / 2 });
      left += w + gap * k;
    });
    rowTop += (rowHs[r] + gap) * k;
  });
  list.forEach((item, i) => {
    const { w, h, x, y } = spots[i];
    const el = document.createElement('div');
    el.className = 'win';
    el.style.cssText = `width:${w}px;height:${h}px;left:${x - w / 2}px;top:${y - h / 2}px;z-index:${++z}`;
    el.dataset.cursor = 'Drag · click to open';
    if (item.type === 'tool') {
      el.classList.add('w-tool');
      el.innerHTML = `<div class="t-in"><img class="t-badge" src="${item.badge}" alt=""><b>${item.name}</b><span>${item.line}</span>${item.sample ? '<i>See a piece ↗</i>' : ''}</div>`;
      if (!item.sample) el.dataset.cursor = 'Drag';
    } else if (item.type === 'brand') {
      el.classList.add('w-brand');
      // A round logo with the name under it, or the name set as a wordmark until he sends a logo.
      const mark = item.logo ? `<img src="${item.logo}" alt="${item.name}" draggable="false">` : `<span class="b-word">${item.name}</span>`;
      el.innerHTML = `${mark}<span class="b-label"><b>${item.name}</b><span>${item.sub}</span></span>`;
      el.dataset.cursor = item.items.length ? `Drag · click to see ${item.items.length > 1 ? 'the work' : 'it'}` : 'Drag';
    } else if (item.type === 'video') {
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.poster = item.poster;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      if (!reduce) { v.autoplay = true; v.src = item.loop; }
      el.appendChild(v);
    } else {
      const img = new Image();
      img.src = item.img; img.alt = item.title; img.draggable = false;
      el.appendChild(img);
    }
    arch.appendChild(el);
    if (!reduce) {
      el.animate([{ transform: `translate(${c.x - x}px, ${c.y - y}px) scale(.2)`, opacity: 0 }, { transform: 'translate(0,0) scale(1)', opacity: 1 }],
        { duration: 680, delay: i * 70, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' });
    }
    wireWin(el, () => {
      if (item.type === 'tool') { if (item.sample) openViewer([item.sample], 0); }
      else if (item.type === 'brand') { if (item.items.length) openViewer(item.items, 0); }
      else openViewer(list, i);
    });
    wins.push(el);
  });
}
function closeArchive() {
  if (!openSet) return;
  const btn = openBtn;
  openSet = null;
  openBtn = null;
  labelFolder(btn, false);
  archHint.hidden = true;
  const c = centreOf(btn), a = arch.getBoundingClientRect();
  const leaving = wins;
  wins = [];
  leaving.forEach((el, i) => {
    if (reduce) { el.remove(); return; }
    const r = el.getBoundingClientRect();
    const dx = c.x - (r.left - a.left + r.width / 2), dy = c.y - (r.top - a.top + r.height / 2);
    el.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(.2)`, opacity: 0 }],
      { duration: 380, delay: (leaving.length - 1 - i) * 40, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' })
      .finished.then(() => el.remove());
  });
}
function wireWin(el, onOpen) {
  el.addEventListener('pointerdown', e => {
    el.style.zIndex = ++z;
    if (e.button !== 0) return;
    e.stopPropagation();
    el.getAnimations().forEach(an => an.finish());
    const sx = e.clientX, sy = e.clientY, l = parseFloat(el.style.left), t = parseFloat(el.style.top);
    let moved = 0;
    el.setPointerCapture(e.pointerId);
    el.classList.add('dragging');
    dragWin = el;
    const move = ev => {
      moved = Math.max(moved, Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy));
      el.style.left = l + ev.clientX - sx + 'px';
      el.style.top = t + ev.clientY - sy + 'px';
    };
    const up = ev => {
      el.classList.remove('dragging');
      dragWin = null;
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      if (ev.type === 'pointerup' && moved < 6) onOpen();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  });
}
folders.forEach(btn => {
  labelFolder(btn, false);
  btn.addEventListener('click', () => {
    const anchor = btn.closest('.f-anchor');
    if (anchor.dataset.dragged) { delete anchor.dataset.dragged; return; } // that press was a drag, not a click
    if (openSet === btn.dataset.set) { closeArchive(); return; }
    const swapping = !!openSet;
    closeArchive();
    setTimeout(() => openArchive(btn), swapping && !reduce ? 260 : 0);
  });
  btn.addEventListener('pointermove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--sx', (100 - ((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
  });
});
arch.addEventListener('click', e => { if (openSet && (e.target === arch || e.target.id === 'fRow')) closeArchive(); });

// Folders can be picked up and dropped anywhere on the table. A press that doesn't move still opens
// the folder; once the pointer has moved 6px it's a drag, and the click that follows is ignored.
$$('.f-anchor', arch).forEach(anchor => {
  anchor.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const sx = e.clientX, sy = e.clientY, id = e.pointerId;
    let dragging = false, ox = 0, oy = 0, box = null, half = null;
    const move = ev => {
      if (ev.pointerId !== id) return;
      if (!dragging) {
        if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 6) return;
        dragging = true;
        anchor.dataset.dragged = '1';
        box = arch.getBoundingClientRect();
        const r = anchor.getBoundingClientRect();
        ox = sx - (r.left + r.width / 2);
        oy = sy - (r.top + r.height / 2);
        half = { w: r.width / 2, h: r.height / 2 };
        anchor.classList.add('dragging');
        dragWin = anchor;
      }
      const x = clamp(ev.clientX - ox - box.left, half.w + 8, box.width - half.w - 8);
      const y = clamp(ev.clientY - oy - box.top, half.h + 8, box.height - half.h - 8);
      // Stored as percentages, so a dropped folder stays put when the window resizes.
      anchor.style.left = (x / box.width) * 100 + '%';
      anchor.style.top = (y / box.height) * 100 + '%';
    };
    const up = ev => {
      if (ev.pointerId !== id) return;
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      if (dragging) {
        anchor.classList.remove('dragging');
        dragWin = null;
        // If no click follows (the pointer ended off the folder), forget the drag flag.
        setTimeout(() => { delete anchor.dataset.dragged; }, 50);
      }
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  });
});

/* ---------- About: the career timeline, scrubbed by scroll ---------- */
const TL = {
  start: 2022, end: 2026.95,
  clips: [
    { track: 0, from: 2022.17, to: 2024.67, label: 'Freelance graphic designer', title: 'Freelance graphic designer', when: 'Mar 2022 – Aug 2024',
      text: 'YouTube thumbnails for creators across niches, freelance design projects from concept to delivery, and fan-art posters to explore new styles.' },
    { track: 0, from: 2024.67, to: 2025.13, label: 'Veda Connection', title: 'Design intern · Veda Connection', when: 'Sep 2024 – Feb 2025',
      text: 'Social media creatives and short-form video for product clients, plus website imagery, packaging, print catalogs and Instagram Stories.' },
    { track: 0, from: 2025.13, to: 2025.58, label: 'Freelance design + edit', title: 'Freelance designer & editor', when: 'Feb 2025 – Aug 2025',
      text: 'Instagram Reels, social creatives, thumbnails and digital assets for creators and brands, from concept to final delivery.' },
    { track: 0, from: 2025.58, to: 2026.95, label: 'The Night Marketer', title: 'Designer & editor · The Night Marketer', when: 'Aug 2025 – now',
      text: 'Short and long-form video for social, campaigns and brands, plus creatives and thumbnails. Edited in Premiere Pro and After Effects, with motion graphics, captions and sound design.' },
    { track: 1, from: 2022.0, to: 2022.95, label: 'DICE Academy', title: 'Diploma in Design · DICE Academy', when: '2022',
      text: 'Diploma in Design from DICE Academy.' },
    { track: 1, from: 2023.5, to: 2026.5, label: 'B.Com · Delhi University', title: 'B.Com · University of Delhi', when: '2023 – 2026',
      text: 'Bachelor of Commerce from the School of Open Learning, alongside design and editing work.' },
  ],
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const tlPct = y => ((y - TL.start) / (TL.end - TL.start)) * 100;
const ruler = $('#tlRuler');
for (let y = 2022; y <= 2026; y++) {
  const s = document.createElement('span');
  s.className = 'tl-year';
  s.style.left = tlPct(y) + '%';
  s.textContent = y;
  ruler.appendChild(s);
}
const clipEls = TL.clips.map(c => {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'tl-clip';
  el.style.left = `calc(${tlPct(c.from)}% + 1px)`;
  el.style.width = `calc(${tlPct(c.to) - tlPct(c.from)}% - 2px)`;
  el.innerHTML = '<span></span>';
  el.firstChild.textContent = c.label;
  el.setAttribute('aria-label', `${c.title}, ${c.when}`);
  $(`.tl-track[data-track="${c.track}"]`).appendChild(el);
  el.addEventListener('click', () => showClip(c, true));
  return el;
});
let shownClip = null;
function showClip(c, moveHead) {
  if (moveHead) setHead(c.from + 0.02);
  if (shownClip === c) return;
  shownClip = c;
  clipEls.forEach((el, i) => el.classList.toggle('on', TL.clips[i] === c));
  $('#tlWhen').textContent = c.when;
  $('#tlTitle').textContent = c.title;
  $('#tlText').textContent = c.text;
  if (gsap && !reduce) gsap.fromTo('.tl-detail', { autoAlpha: 0.2, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' });
}
function setHead(y) {
  tlY = y;
  $('#tlPlay').style.left = tlPct(y) + '%';
  const m = Math.floor((y % 1) * 12 + 1e-6);
  $('#tlTc').textContent = y >= TL.end - 0.1 ? 'Now' : `${MONTHS[clamp(m, 0, 11)]} ${Math.floor(y)}`;
}
function headAt(y) {
  setHead(y);
  const work = TL.clips.find(c => c.track === 0 && y >= c.from && y < c.to);
  const study = TL.clips.find(c => c.track === 1 && y >= c.from && y < c.to);
  const c = work || study;
  if (c) showClip(c, false);
}
// Scrolling plays the timeline until you touch it; after that it's yours (drag the playhead, click a clip, or the arrows).
let tlY = TL.start, tlManual = false;
function takeControl() { tlManual = true; $('#tl').classList.add('manual'); }
if (gsap && ScrollTrigger && !reduce) {
  ScrollTrigger.create({
    trigger: '#tl', start: 'top 85%', end: 'bottom 30%', scrub: 0.4,
    onUpdate: s => { if (!tlManual) headAt(TL.start + 0.05 + s.progress * (TL.end - TL.start - 0.1)); },
  });
}
headAt(reduce ? TL.end - 0.2 : TL.start + 0.25);
clipEls.forEach(el => el.addEventListener('click', takeControl));
// Drag anywhere on the tracks to move the playhead. A press that doesn't move is left alone, so clips stay clickable.
const tlBody = $('#tlBody');
tlBody.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  const r = tlBody.getBoundingClientRect(), sx = e.clientX, sy = e.clientY;
  const at = x => TL.start + clamp((x - r.left) / r.width, 0, 0.995) * (TL.end - TL.start);
  let moving = !!e.target.closest('#tlPlay');
  if (moving) { takeControl(); tlBody.setPointerCapture(e.pointerId); headAt(at(e.clientX)); }
  const move = ev => {
    if (!moving) {
      if (Math.abs(ev.clientX - sx) < 6 || Math.abs(ev.clientY - sy) > Math.abs(ev.clientX - sx)) return; // a vertical swipe still scrolls
      moving = true; takeControl(); tlBody.setPointerCapture(ev.pointerId);
    }
    tlBody.classList.add('scrubbing');
    headAt(at(ev.clientX));
  };
  const up = () => { tlBody.classList.remove('scrubbing'); tlBody.removeEventListener('pointermove', move); };
  tlBody.addEventListener('pointermove', move);
  tlBody.addEventListener('pointerup', up, { once: true });
  tlBody.addEventListener('pointercancel', up, { once: true });
});
// The arrows step from one chapter (clip start) to the next, in time order.
const chapters = [...new Set(TL.clips.map(c => c.from))].sort((a, b) => a - b);
function step(dir) {
  takeControl();
  const next = dir > 0 ? chapters.find(y => y > tlY + 0.03) : [...chapters].reverse().find(y => y < tlY - 0.03);
  headAt((next ?? (dir > 0 ? chapters.at(-1) : chapters[0])) + 0.02);
}
$('#tlPrev').addEventListener('click', () => step(-1));
$('#tlNext').addEventListener('click', () => step(1));
$('#tl').addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); step(e.key === 'ArrowRight' ? 1 : -1); }
});

/* ---------- Viewer ---------- */
const lb = $('#lb'), lbMedia = $('#lbMedia');
let lbList = [], lbI = 0, lbOpen = false, lbReturn = null;
function renderViewer() {
  const it = lbList[lbI];
  lbMedia.replaceChildren();
  let el;
  if (it.type === 'video') {
    el = document.createElement('video');
    el.src = it.src; el.poster = it.poster; el.controls = true; el.autoplay = true; el.playsInline = true;
    el.setAttribute('playsinline', '');
  } else {
    el = new Image();
    el.src = it.src; el.alt = it.title;
  }
  lbMedia.append(el);
  lbMedia.classList.remove('enter');
  void lbMedia.offsetWidth;
  lbMedia.classList.add('enter');
  $('#lbIdx').textContent = `${pad(lbI + 1)} / ${pad(lbList.length)}`;
  $('#lbTitle').textContent = it.title;
  $('#lbMeta').textContent = it.meta;
  const multi = lbList.length > 1;
  $('#lbPrev').hidden = !multi;
  $('#lbNext').hidden = !multi;
}
function openViewer(list, i) {
  lbList = list;
  lbI = i;
  lbReturn = document.activeElement;
  renderViewer();
  lb.hidden = false;
  if (!lbOpen) lock(true);
  lbOpen = true;
  if (drum) drum.pause();
  $('.lb-close', lb).focus({ preventScroll: true });
}
function closeViewer() {
  if (!lbOpen) return;
  const v = $('video', lbMedia);
  if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
  lbMedia.replaceChildren();
  lb.hidden = true;
  lbOpen = false;
  lock(false);
  if (drum) drum.resume();
  if (lbReturn && lbReturn.focus) lbReturn.focus({ preventScroll: true });
}
const stepViewer = d => { lbI = (lbI + d + lbList.length) % lbList.length; renderViewer(); };
lb.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeViewer(); });
$('#lbPrev').addEventListener('click', () => stepViewer(-1));
$('#lbNext').addEventListener('click', () => stepViewer(1));

/* ---------- Keyboard ---------- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (lbOpen) closeViewer();
    else if (sheetOpen) closeSheet();
    else if (openSet) closeArchive();
    else setMenu(false);
    return;
  }
  if (lbOpen) {
    if (e.key === 'ArrowRight') stepViewer(1);
    else if (e.key === 'ArrowLeft') stepViewer(-1);
    else if (e.key === 'Tab') {
      const f = $$('button:not([hidden]), video', lb);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
});
