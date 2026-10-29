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
const VIDEOS = [
  V('v08', 'Wardrobe stylist reel', 'Short form · 1:14'),
  V('v05', 'Quotation hand-off explainer', 'Motion graphics · Hinglish · 0:57'),
  V('v07', 'Royale shoe unboxing', 'Product video · 0:22'),
  V('v01', 'Raftaar AI ad', 'AI video · 0:24'),
  V('v12', 'Five repos explainer', 'Talking head + motion · 1:01'),
  V('v03', 'AI kitchen ad', 'AI video · 0:32'),
  V('v10', 'Kinetic type edit', 'Short form · 0:23'),
  V('v06', 'Monk strap shoe film', 'Product video · 0:33'),
  V('v11', 'Shopify to CRM explainer', 'Talking head + motion · 0:58'),
  V('v09', 'Styling tips reel', 'Short form · 0:39'),
  V('v02', 'Raftaar crew ad', 'AI video · 0:30'),
  V('v04', 'Saachi Realtors reel', 'AI video · 0:17'),
];
const D = (file, title, meta, ratio) => ({ type: 'image', img: `assets/img/${file}`, src: `assets/img/${file}`, title, meta, ratio });
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

/* ---------- Hero: the laptop lid opens on every load, then the desktop comes alive ---------- */
// Run fn once the page is visible and painting (rAF only fires then), so the opening is never
// played into a background tab.
function whenVisible(fn) {
  const go = () => requestAnimationFrame(() => requestAnimationFrame(fn));
  if (document.visibilityState === 'visible') { go(); return; }
  const onShow = () => {
    if (document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', onShow);
    go();
  };
  document.addEventListener('visibilitychange', onShow);
}
function openLaptop() {
  const cam = $('#cam'), lid = $('#lid'), power = $('#power');
  if (!gsap) { html.classList.remove('boot'); return; }
  // Take over from the CSS closed state: close up, looking down on a shut laptop.
  // With Reduce Motion on, the camera stays still and only the lid opens.
  if (reduce) gsap.set(cam, { x: 0, y: 0, yPercent: 0, scale: 1, rotationX: 0 });
  else gsap.set(cam, { x: 0, y: 0, yPercent: -18, scale: 1.12, rotationX: -46, transformOrigin: '50% 60%' });
  bar.classList.add('tuck');
  gsap.set(lid, { rotationX: -89, transformOrigin: '50% 100%' });
  gsap.set(power, { autoAlpha: 1 });
  html.classList.remove('boot');
  gsap.set(heroChars, { autoAlpha: 0 });
  gsap.set('.mb', { yPercent: -100 });
  gsap.set('.desk-icons, .hero-content .hero-tags, .hero-sub, .hero-content .hero-line, .hero-below, .scroll-cue', { autoAlpha: 0, y: 10 });
  // WAAPI on transform only, so the dock's centring (the CSS translate property) is never touched.
  dock.animate([{ transform: 'translateY(170%)' }, { transform: 'none' }], { duration: 750, delay: 2050, easing: 'cubic-bezier(.34,1.4,.64,1)', fill: 'backwards' });
  // The camera swings down to eye level and pulls back while the lid lifts, then the screen wakes up.
  gsap.timeline()
    .to(cam, { yPercent: 0, scale: 1, rotationX: 0, duration: reduce ? 0 : 2.3, ease: 'power3.inOut' }, 0.3)
    .to(lid, { rotationX: 0, duration: 1.4, ease: 'power2.inOut' }, 0.75)
    .to(power, { autoAlpha: 0, duration: 0.45 }, 1.75)
    .to('.mb', { yPercent: 0, duration: 0.5, ease: 'power3.out' }, 1.95)
    .to(heroChars, { autoAlpha: 1, duration: 0.01, stagger: 0.05 }, 2.0)
    .to('.hero-content .hero-tags, .hero-sub, .hero-content .hero-line, .desk-icons, .hero-below, .scroll-cue', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 }, 2.25)
    .add(() => { heroChars[KEEP].classList.remove('swap'); void heroChars[KEEP].offsetWidth; heroChars[KEEP].classList.add('swap'); }, 2.0 + heroChars.length * 0.05 + 0.05)
    .add(() => bar.classList.remove('tuck'), 2.4)
    .add(() => ripple(heroChars, KEEP), 3.4);
}
document.fonts.ready.then(() => {
  lockWidths(heroChars);
  heroChars[KEEP].classList.add('swap');
  whenVisible(openLaptop);
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
    // As you scroll on, the laptop tips back and shrinks away.
    gsap.timeline({ scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true } })
      .to('#laptop', { scale: 0.86, rotationX: 16, yPercent: -6, ease: 'none' }, 0)
      .to('.scroll-cue, .hero-below', { autoAlpha: 0, ease: 'none' }, 0);
    $$('.split').forEach(el => {
      const words = splitWords(el);
      gsap.from(words, { yPercent: 45, autoAlpha: 0, duration: 0.75, ease: 'power3.out', stagger: 0.045, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });
    $$('.rv').forEach(el => gsap.from(el, { y: 40, autoAlpha: 0, duration: 0.95, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
    gsap.from('.c-row', { yPercent: 40, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '.c-rows', start: 'top 85%', once: true } });
    gsap.from('.foot-big', { yPercent: 30, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.foot-big', start: 'top 95%', once: true } });
  }
}

/* ---------- Desk: hotspots and the bottom sheet ---------- */
const deskScene = $('#deskScene'), spots = $$('.spot', deskScene);
const sheetLayer = $('#sheetLayer'), sheetBody = $('#sheetBody');
let sheetOpen = false, sheetReturn = null;
function setOn(spot) {
  spots.forEach(s => s.classList.toggle('on', s === spot));
  deskScene.classList.toggle('has-on', !!spot);
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
  spot.addEventListener('click', () => { setOn(spot); openSheet(spot.dataset.sheet); });
});

/* ---------- Work: the drum ---------- */
const stage = $('#stage'), seg = $('#seg'), segPill = $('#segPill');
let drum = null, drumState = 'idle', mode = 'video', fallback = null;
const currentList = () => (mode === 'video' ? VIDEOS : DESIGNS);
function caption(i, item) {
  $('#dIdx').textContent = `${pad(i + 1)} / ${pad(currentList().length)}`;
  $('#dTitle').textContent = item.title;
  $('#dMeta').textContent = item.meta;
}
function buildFallback() {
  if (!fallback) {
    fallback = document.createElement('div');
    fallback.className = 'fallback-row';
    stage.replaceWith(fallback);
  }
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
    const mod = await import('./drum.js?v=20');
    drum = mod.createDrum(stage, {
      items: currentList(), aspect: mode === 'video' ? 9 / 16 : 4 / 5, bg: '#07182f', reduce,
      onChange: caption,
      onOpen: i => openViewer(currentList(), i),
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

function placePill(btn, animate) {
  const left = btn.offsetLeft, width = btn.offsetWidth;
  const prevLeft = parseFloat(segPill.style.left || left);
  const right = left > prevLeft;
  if (!animate || reduce) {
    segPill.style.transition = 'none';
    segPill.style.left = left + 'px';
    segPill.style.width = width + 'px';
    return;
  }
  // The leading edge moves first and the trailing edge catches up, so the pill stretches.
  segPill.style.transition = right
    ? 'width .38s cubic-bezier(.34,1.3,.64,1), left .4s cubic-bezier(.34,1.3,.64,1) .055s'
    : 'left .38s cubic-bezier(.34,1.56,.64,1), width .4s cubic-bezier(.34,1.3,.64,1) .055s';
  if (right) {
    segPill.style.width = left + width - prevLeft + 'px';
    setTimeout(() => { segPill.style.left = left + 'px'; segPill.style.width = width + 'px'; }, 110);
  } else {
    segPill.style.left = left + 'px';
    segPill.style.width = width + 'px';
  }
}
function setMode(m) {
  if (m === mode) return;
  mode = m;
  const btn = $(`[data-mode="${m}"]`, seg);
  $$('button', seg).forEach(x => x.setAttribute('aria-selected', String(x === btn)));
  placePill(btn, true);
  caption(0, currentList()[0]);
  if (drum) drum.setItems(currentList(), m === 'video' ? 9 / 16 : 4 / 5);
  else if (fallback) buildFallback();
}
seg.addEventListener('click', e => { const b = e.target.closest('button[data-mode]'); if (b) setMode(b.dataset.mode); });
document.fonts.ready.then(() => placePill($('[aria-selected="true"]', seg), false));
addEventListener('resize', () => placePill($('[aria-selected="true"]', seg), false));

/* ---------- Archive: folders that throw their contents onto the table ---------- */
const arch = $('#arch'), archHint = $('#archHint');
const SETS = {
  designs: [
    { item: DESIGNS[0], at: [0.14, 0.26] },
    { item: DESIGNS[1], at: [0.86, 0.27] },
    { item: DESIGNS[2], at: [0.5, 0.83] },
  ],
  packaging: [
    { item: DESIGNS[3], at: [0.2, 0.25] },
    { item: DESIGNS[4], at: [0.84, 0.5] },
  ],
  reels: [
    { item: byId('v08'), at: [0.1, 0.5] },
    { item: byId('v10'), at: [0.9, 0.5] },
    { item: byId('v07'), at: [0.3, 0.18] },
    { item: byId('v05'), at: [0.7, 0.83] },
  ],
};
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
  const W = arch.clientWidth, H = arch.clientHeight, c = centreOf(btn);
  const base = Math.min(200, Math.max(100, W * 0.16));
  const list = SETS[openSet].map(s => s.item);
  SETS[openSet].forEach(({ item, at }, i) => {
    const ratio = item.type === 'video' ? 9 / 16 : item.ratio;
    const area = base * base * (ratio > 1.2 ? 1.25 : ratio < 0.7 ? 0.9 : 1);
    const w = Math.sqrt(area * ratio), h = w / ratio;
    const x = clamp(at[0] * W, w / 2 + 10, W - w / 2 - 10);
    const y = clamp(at[1] * H, h / 2 + 10, H - h / 2 - 10);
    const el = document.createElement('div');
    el.className = 'win';
    el.style.cssText = `width:${w}px;height:${h}px;left:${x - w / 2}px;top:${y - h / 2}px;z-index:${++z}`;
    el.dataset.cursor = 'Drag · click to open';
    if (item.type === 'video') {
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
    wireWin(el, () => openViewer(list, i));
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

/* ---------- About: the photo tilts toward the cursor and throws out a few tools ---------- */
const portrait = $('#portrait'), pfTilt = $('#pfTilt');
if (portrait) {
  const settle = () => { portrait.classList.remove('hot'); pfTilt.style.transform = ''; };
  portrait.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = pfTilt.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    portrait.classList.add('hot');
    if (!reduce) pfTilt.style.transform = `rotateX(${((0.5 - py) * 14).toFixed(2)}deg) rotateY(${((px - 0.5) * 16).toFixed(2)}deg) scale(1.03)`;
    pfTilt.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
    pfTilt.style.setProperty('--my', (py * 100).toFixed(1) + '%');
  });
  portrait.addEventListener('pointerleave', settle);
  // On touch, a tap shows the tools for a moment.
  portrait.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    portrait.classList.add('hot');
    clearTimeout(portrait._t);
    portrait._t = setTimeout(settle, 1800);
  });
}

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
if (gsap && ScrollTrigger && !reduce) {
  ScrollTrigger.create({
    trigger: '#tl', start: 'top 85%', end: 'bottom 30%', scrub: 0.4,
    onUpdate: s => headAt(TL.start + 0.05 + s.progress * (TL.end - TL.start - 0.1)),
  });
}
headAt(reduce ? TL.end - 0.2 : TL.start + 0.25);

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
