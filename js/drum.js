// The drum: work cards wrapped round a 3D cylinder, after the "Drum" mode on gahanrao.com.
// Each card is a bent plane (vertex shader) that shades toward the background as it turns
// away, picks up a sheen, and smears sideways while the drum spins. The middle card swaps its
// poster for a playing video loop once the drum settles.
import * as THREE from 'three';

const VERT = /* glsl */`
  uniform float uCurv;
  uniform float uAngle;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vec3 p = position;
    float r = 1.0 / uCurv;
    float a = p.x * uCurv;
    p.x = r * sin(a);
    p.z = r * cos(a) - r;
    vFacing = cos(uAngle + a);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */`
  uniform sampler2D uMap;
  uniform vec2 uScale;
  uniform vec2 uOffset;
  uniform float uAspect;
  uniform float uRadius;
  uniform float uFade;
  uniform float uShade;
  uniform float uAngle;
  uniform float uBlur;
  uniform float uReady;
  uniform float uGlobal;
  uniform vec3 uBg;
  uniform vec3 uBlank;
  varying vec2 vUv;
  varying float vFacing;

  float sdRound(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 uv = vUv * uScale + uOffset;
    vec3 c = vec3(0.0);
    float w = 0.0;
    for (int i = -3; i <= 3; i++) {
      float o = float(i) / 3.0;
      float k = 1.0 - abs(o) * 0.6;
      c += texture2D(uMap, uv + vec2(o * uBlur, 0.0)).rgb * k;
      w += k;
    }
    c = mix(uBlank, c / w, uReady);
    float band = exp(-pow((vUv.x - 0.5 + (vUv.y - 0.5) * 0.4 + sin(uAngle) * 0.8) * 2.6, 2.0));
    c += 0.14 * abs(sin(uAngle)) * band;
    float facing = clamp(vFacing, 0.0, 1.0);
    c = mix(uBg, c, mix(1.0, pow(facing, 0.8), uShade));
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float d = sdRound(p, vec2(uAspect * 0.5, 0.5), uRadius);
    float aa = fwidth(d);
    float alpha = (1.0 - smoothstep(-aa, aa, d)) * uFade * uGlobal;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(c, alpha);
  }
`;

const RADIUS = 1.35;   // drum radius, in card heights
const GAP = 0.07;      // arc length between cards
const FOV = 32;

function smooth(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function hex(c) { const n = parseInt(c.slice(1), 16); return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); }

export function createDrum(el, opts) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    return null;
  }
  if (!renderer.getContext()) return null;

  const reduce = opts.reduce;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  el.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  const loader = new THREE.TextureLoader();
  const blank = new THREE.DataTexture(new Uint8Array([10, 30, 60, 255]), 1, 1);
  blank.needsUpdate = true;
  const global = { value: 1 };
  const bg = hex(opts.bg || '#07182f');
  const blankCol = hex('#0e2747');

  let items = [], cards = [], aspect = 0.5625, step = 0.5;
  let pos = 0, target = 0, vel = 0, raf = 0, last = 0, settled = false, visible = true, dirty = true;
  let pxPerCard = 200, width = 1, height = 1;
  let active = null; // { card, video, tex }

  function texCover(u, tw, th) {
    const ta = tw / th;
    if (ta > aspect) { u.uScale.value.set(aspect / ta, 1); u.uOffset.value.set((1 - aspect / ta) / 2, 0); }
    else { u.uScale.value.set(1, ta / aspect); u.uOffset.value.set(0, (1 - ta / aspect) / 2); }
  }

  function build(list, cardAspect) {
    cards.forEach(c => {
      scene.remove(c.mesh);
      c.mesh.geometry.dispose();
      c.mat.dispose();
      if (c.tex) c.tex.dispose();
      if (c.video) { c.video.pause(); c.video.removeAttribute('src'); c.video.load(); }
    });
    if (active && active.tex) active.tex.dispose();
    active = null;
    items = list;
    aspect = cardAspect;
    step = (aspect + GAP) / RADIUS;
    const geo = () => new THREE.PlaneGeometry(aspect, 1, 48, 1);
    cards = items.map(item => {
      const uniforms = {
        uMap: { value: blank }, uScale: { value: new THREE.Vector2(1, 1) }, uOffset: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: aspect }, uRadius: { value: 0.045 }, uFade: { value: 1 }, uShade: { value: 0.85 },
        uAngle: { value: 0 }, uBlur: { value: 0 }, uReady: { value: 0 }, uGlobal: global,
        uCurv: { value: 1 / RADIUS }, uBg: { value: bg }, uBlank: { value: blankCol },
      };
      const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false });
      const mesh = new THREE.Mesh(geo(), mat);
      scene.add(mesh);
      const card = { item, mesh, mat, tex: null, video: null };
      loader.load(item.poster || item.img, tex => {
        tex.colorSpace = THREE.NoColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        card.tex = tex;
        if (!active || active.card !== card || !active.tex) {
          uniforms.uMap.value = tex;
          texCover(uniforms, tex.image.width, tex.image.height);
        }
        uniforms.uReady.value = 1;
        dirty = true;
        kick();
      });
      return card;
    });
    resize();
  }

  function offset(i) {
    const n = items.length;
    let d = (((i - pos) % n) + n) % n;
    if (d >= n / 2) d -= n;
    return d;
  }

  function layout() {
    const blur = reduce ? 0 : Math.min(0.035, Math.max(0, Math.abs(vel) - 0.4) * 0.012);
    cards.forEach((c, i) => {
      const d = offset(i);
      const s = d * step;
      c.mesh.position.set(RADIUS * Math.sin(s), 0, RADIUS * Math.cos(s) - RADIUS);
      c.mesh.rotation.y = s;
      c.mesh.renderOrder = 100 - Math.round(Math.abs(d) * 10);
      const u = c.mat.uniforms;
      u.uAngle.value = s;
      u.uFade.value = 1 - smooth(1.45, 1.75, Math.abs(s));
      u.uBlur.value = blur;
      c.mesh.visible = u.uFade.value > 0.003;
    });
  }

  function resize() {
    width = el.clientWidth || 1;
    height = el.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const t = Math.tan((FOV * Math.PI) / 360);
    // Fit the middle card: 64% of the height on desktop. Phones get a smaller drum:
    // 54% of the height and never wider than 44% of the width, so the side cards show.
    const phone = width < 700;
    const byH = 1 / ((phone ? 0.54 : 0.64) * 2 * t);
    const byW = aspect / ((phone ? 0.44 : 0.62) * 2 * t * camera.aspect);
    camera.position.set(0, 0, Math.max(byH, byW));
    camera.updateProjectionMatrix();
    const visW = 2 * camera.position.z * t * camera.aspect;
    pxPerCard = (aspect / visW) * width;
    layout();
    renderer.render(scene, camera);
  }

  function centre() { const n = items.length; return ((Math.round(target) % n) + n) % n; }

  function stopActive() {
    if (!active) return;
    const { card, video, tex } = active;
    video.pause();
    if (card.tex) {
      card.mat.uniforms.uMap.value = card.tex;
      texCover(card.mat.uniforms, card.tex.image.width, card.tex.image.height);
    }
    if (tex) tex.dispose();
    active = null;
  }

  function startActive() {
    const c = cards[centre()];
    if (!c || !c.item.loop || reduce || !visible) return;
    if (active && active.card === c) { active.video.play().catch(() => {}); kick(); return; }
    stopActive();
    if (!c.video) {
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.crossOrigin = 'anonymous';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.src = c.item.loop;
      c.video = v;
    }
    const v = c.video;
    const me = { card: c, video: v, tex: null };
    active = me;
    const swapIn = () => {
      if (active !== me) return;
      const tex = new THREE.VideoTexture(v);
      tex.colorSpace = THREE.NoColorSpace;
      tex.minFilter = THREE.LinearFilter;
      me.tex = tex;
      c.mat.uniforms.uMap.value = tex;
      texCover(c.mat.uniforms, v.videoWidth || 9, v.videoHeight || 16);
      dirty = true;
      kick();
    };
    v.play().then(() => {
      if (v.readyState >= 2) swapIn(); else v.addEventListener('loadeddata', swapIn, { once: true });
    }).catch(() => {});
  }

  function settle() {
    opts.onChange && opts.onChange(centre(), items[centre()]);
    startActive();
  }

  function frame(now) {
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    const k = reduce ? 1000 : dragging ? 30 : 8.5;
    const prev = pos;
    pos += (target - pos) * (1 - Math.exp(-dt * k));
    vel = (pos - prev) / Math.max(dt, 0.001);
    const moving = dragging || Math.abs(target - pos) > 0.0006;
    if (!moving && !settled) { pos = target; vel = 0; settled = true; layout(); renderer.render(scene, camera); settle(); }
    if (moving) {
      if (settled) { settled = false; stopActive(); }
      layout();
      renderer.render(scene, camera);
    } else if (dirty || (active && active.tex)) {
      layout();
      renderer.render(scene, camera);
    }
    dirty = false;
    if (visible && (moving || (active && !active.video.paused))) raf = requestAnimationFrame(frame);
    else { raf = 0; last = 0; }
  }
  function kick() { if (!raf && visible) { last = 0; raf = requestAnimationFrame(frame); } }

  function go(delta) { target = Math.round(target) + delta; kick(); }
  function goTo(i) {
    const n = items.length;
    const cur = centre();
    let d = (((i - cur) % n) + n) % n;
    if (d > n / 2) d -= n;
    go(d);
  }

  // Input: drag with a fling, horizontal wheel, arrow keys, taps on the sides.
  let dragging = false, sx = 0, sTarget = 0, lastX = 0, lastT = 0, flick = 0, moved = 0, pid = null;
  el.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.target.closest('button')) return;
    dragging = true; pid = e.pointerId; sx = lastX = e.clientX; lastT = performance.now(); sTarget = target; flick = 0; moved = 0;
    el.setPointerCapture(e.pointerId);
    kick();
  });
  el.addEventListener('pointermove', e => {
    if (!dragging) {
      if (opts.onCursor && e.pointerType === 'mouse') {
        const r = el.getBoundingClientRect();
        opts.onCursor(Math.abs(e.clientX - (r.left + r.width / 2)) < pxPerCard / 2 ? 'Play' : 'Drag');
      }
      return;
    }
    const now = performance.now();
    const dx = e.clientX - sx;
    moved = Math.max(moved, Math.abs(dx));
    flick = flick * 0.6 + ((e.clientX - lastX) / Math.max(1, now - lastT)) * 0.4;
    lastX = e.clientX; lastT = now;
    target = sTarget - dx / pxPerCard;
    kick();
  });
  const release = (e, cancelled) => {
    if (!dragging || e.pointerId !== pid) return;
    dragging = false;
    if (!cancelled && moved < 6) {
      target = Math.round(sTarget);
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      if (Math.abs(dx) < pxPerCard / 2) opts.onOpen && opts.onOpen(centre(), items[centre()]);
      else go(dx < 0 ? -1 : 1);
      return;
    }
    if (performance.now() - lastT > 90) flick = 0;
    const extra = Math.abs(flick) < 0.25 ? 0 : Math.max(-2, Math.min(2, ((-flick * 1000) / pxPerCard) * 0.16));
    target = Math.round(target + extra);
    kick();
  };
  el.addEventListener('pointerup', e => release(e, false));
  el.addEventListener('pointercancel', e => release(e, true));
  el.addEventListener('pointerleave', () => opts.onCursor && opts.onCursor(null));
  let wheelTimer = 0;
  el.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) return; // vertical scrolling keeps moving the page
    e.preventDefault();
    target += e.deltaX / pxPerCard;
    kick();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { target = Math.round(target); kick(); }, 130);
  }, { passive: false });
  el.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); opts.onOpen && opts.onOpen(centre(), items[centre()]); }
  });

  new ResizeObserver(() => resize()).observe(el);
  new IntersectionObserver(entries => {
    visible = entries.some(en => en.isIntersecting);
    if (!visible) { if (active) active.video.pause(); }
    else { dirty = true; if (settled) startActive(); kick(); }
  }, { threshold: 0.05 }).observe(el);

  // Swap the whole set (videos ↔ designs): fade out, rebuild, fade back in.
  function setItems(list, cardAspect) {
    const fadeTo = (to, ms) => new Promise(done => {
      const from = global.value, t0 = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - t0) / ms);
        global.value = from + (to - from) * (1 - Math.pow(1 - p, 3));
        renderer.render(scene, camera);
        p < 1 ? requestAnimationFrame(tick) : done();
      };
      requestAnimationFrame(tick);
    });
    stopActive();
    return (reduce ? Promise.resolve() : fadeTo(0, 220)).then(() => {
      pos = target = 0;
      settled = false;
      build(list, cardAspect);
      layout();
      return reduce ? null : fadeTo(1, 380);
    }).then(() => { global.value = 1; kick(); });
  }

  build(opts.items, opts.aspect || 0.5625);
  kick();

  return {
    go, goTo, setItems,
    index: () => centre(),
    pause: () => { if (active) active.video.pause(); },
    resume: () => { if (settled) startActive(); },
  };
}
