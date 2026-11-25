/**
 * Interacciones de la landing (sin librerías):
 * apariciones y contadores · palabra rotativa · video diferido con póster · STHEAMI · checklist ·
 * formulario → WhatsApp · Lunita guía por secciones · eventos de conversión (píxeles, si están activos).
 */
import { initLunitas } from './lunita';

declare global { interface Window { lunitaTrack?: (kind: string, data?: Record<string, string>) => void } }

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const track = (kind: string, data?: Record<string, string>) => window.lunitaTrack?.(kind, data);

initLunitas();
const lunApi = (el: Element | null) => (el as any)?.__lunita as { tap: () => void } | undefined;

/* ---------- Apariciones ---------- */
$$('.section-head h2').forEach((el) => el.setAttribute('data-reveal', 'mask'));
$$('.section-head > p:not(.kicker)').forEach((el) => { el.setAttribute('data-reveal', ''); el.style.setProperty('--d', '2'); });
$$('.levels, .bento, .costs, .steps, .faq, .stats-row').forEach((g) =>
  [...g.children].forEach((c, i) => { const el = c as HTMLElement; if (!el.hasAttribute('data-reveal')) { el.setAttribute('data-reveal', i % 2 ? 'rise' : 'rise-alt'); el.style.setProperty('--d', String(i % 6)); } }),
);
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
$$('[data-reveal]').forEach((el) => io.observe(el));

/* ---------- Contadores ---------- */
const cio = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  const el = e.target as HTMLElement; cio.unobserve(el);
  const to = Number(el.dataset.count); if (reduce) return;
  const t0 = performance.now();
  const tick = (t: number) => { const p = Math.min(1, (t - t0) / 1400); el.textContent = String(Math.round(to * (1 - (1 - p) ** 4))); if (p < 1) requestAnimationFrame(tick); };
  el.textContent = '0'; requestAnimationFrame(tick);
}), { threshold: 0.6 });
$$('[data-count]').forEach((el) => cio.observe(el));

/* ---------- Palabra rotativa del hero (se detiene tras dos vueltas, WCAG 2.2.2) ---------- */
const rot = $('[data-rot]');
if (rot && !reduce) {
  const words = $$('.word', rot);
  const heroLuni = $('.hero-luni');
  let w = 0, cycles = 0;
  const fit = () => { rot.style.width = `${words[w].offsetWidth}px`; };
  fit(); document.fonts?.ready.then(fit); addEventListener('resize', fit);
  const timer = setInterval(() => {
    if (document.hidden) return;
    const old = words[w]; old.classList.remove('on'); old.classList.add('out'); setTimeout(() => old.classList.remove('out'), 500);
    w = (w + 1) % words.length;
    words[w].classList.add('on'); fit(); lunApi(heroLuni)?.tap();
    if (w === 0 && ++cycles >= 2) clearInterval(timer);
  }, 2600);
}

/* ---------- Video diferido: se carga al verse, silenciado, con póster ---------- */
const vcard = $('[data-video]');
if (vcard) {
  const video = $<HTMLVideoElement>('video', vcard)!;
  const playBtn = $('[data-play]', vcard)!, toggle = $('[data-toggle]', vcard)!, sound = $('[data-sound]', vcard)!, soundLabel = $('[data-sound-label]', vcard)!;
  const saveData = (navigator as any).connection?.saveData === true;
  let loaded = false;
  const load = () => {
    if (loaded) return; loaded = true;
    const trackEl = video.querySelector('track');
    for (const s of JSON.parse(video.dataset.sources || '[]')) { const el = document.createElement('source'); el.src = s.src; el.type = s.type; video.insertBefore(el, trackEl); }
    video.load();
  };
  const sync = () => {
    vcard.classList.toggle('is-playing', !video.paused);
    toggle.setAttribute('aria-label', video.paused ? 'Reproducir video' : 'Pausar video');
    sound.setAttribute('aria-pressed', String(!video.muted));
    soundLabel.textContent = video.muted ? 'Activar sonido' : 'Silenciar';
    sound.setAttribute('aria-label', soundLabel.textContent);
  };
  const play = () => { load(); video.play().then(sync).catch(sync); };
  ['play', 'pause', 'volumechange'].forEach((e) => video.addEventListener(e, sync));
  playBtn.addEventListener('click', () => { video.muted = false; play(); track('video', { action: 'play' }); });
  toggle.addEventListener('click', () => (video.paused ? play() : video.pause()));
  sound.addEventListener('click', () => { video.muted = !video.muted; if (video.paused) play(); });
  // Autoreproducción silenciada al estar en pantalla (no con ahorro de datos ni con movimiento reducido)
  if (!reduce && !saveData) {
    const start = () => new IntersectionObserver(([e], o) => {
      if (e.isIntersecting) { play(); o.disconnect(); new IntersectionObserver(([x]) => { if (!x.isIntersecting && !video.paused) video.pause(); }, { threshold: 0 }).observe(vcard); }
    }, { threshold: 0.35 }).observe(vcard);
    if (document.readyState === 'complete') setTimeout(start, 600); else addEventListener('load', () => setTimeout(start, 600), { once: true });
  }
}

/* ---------- STHEAMI: pestañas ---------- */
const tiles = $$<HTMLButtonElement>('[data-tile]');
const tileText = $('#stheami-text');
tiles.forEach((t) => t.addEventListener('click', () => {
  tiles.forEach((x) => x.setAttribute('aria-selected', String(x === t)));
  if (tileText) tileText.innerHTML = `<strong>${t.dataset.name}:</strong> ${t.dataset.text}`;
}));
$('.tiles')?.addEventListener('keydown', (e) => {
  const k = (e as KeyboardEvent).key; const i = tiles.findIndex((t) => t.getAttribute('aria-selected') === 'true');
  const n = k === 'ArrowRight' ? (i + 1) % tiles.length : k === 'ArrowLeft' ? (i - 1 + tiles.length) % tiles.length : -1;
  if (n >= 0) { e.preventDefault(); tiles[n].click(); tiles[n].focus(); }
});

/* ---------- Checklist de requisitos ---------- */
const list = $('[data-checklist]');
if (list) {
  const boxes = $$<HTMLInputElement>('input[type=checkbox]', list);
  const done = $('[data-done]', list)!, bar = $('[data-bar]', list)!;
  const upd = () => {
    const n = boxes.filter((b) => b.checked).length;
    done.textContent = String(n); bar.style.width = `${(n / boxes.length) * 100}%`;
    if (n === boxes.length) { guideSay('celebra', '¡Listo! Ya tienes todos los documentos'); }
  };
  boxes.forEach((b) => b.addEventListener('change', upd));
}

/* ---------- Formulario → WhatsApp ---------- */
const form = $<HTMLFormElement>('[data-form]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(form);
  const name = String(f.get('name') || '').trim(), grade = String(f.get('grade') || ''), phone = String(f.get('phone') || '').trim();
  const err = $('[data-error]', form)!;
  const bad = !name || name.length < 3 ? 'f-name' : !grade ? 'f-grade' : !/^[0-9 +()-]{7,}$/.test(phone) ? 'f-phone' : '';
  $$('input, select', form).forEach((el) => el.removeAttribute('aria-invalid'));
  if (bad) {
    const msg = { 'f-name': 'Escribe tu nombre.', 'f-grade': 'Elige el grado de interés.', 'f-phone': 'Escribe un teléfono válido.' }[bad]!;
    err.textContent = msg; err.hidden = false;
    const el = document.getElementById(bad)!; el.setAttribute('aria-invalid', 'true'); el.focus();
    return;
  }
  err.hidden = true;
  const text = `Hola, soy ${name}. Quiero información sobre las Matrículas 2027 para el grado ${grade}. Mi teléfono es ${phone}.`;
  track('form', { grade });
  const url = `https://wa.me/573134320295?text=${encodeURIComponent(text)}`;
  const win = window.open(url, '_blank', 'noopener');
  if (!win) location.href = url;
  guideSay('celebra', '¡Gracias! Te respondemos pronto');
});

/* ---------- Eventos de conversión ---------- */
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLElement>('[data-track]');
  if (a) track(a.dataset.track!, { where: a.dataset.where || '' });
});

/* ---------- Lunita guía ---------- */
const guide = $('[data-guide-el]');
const guideLuni = guide ? $('.lunita', guide) : null;
const bubble = guide ? $('[data-bubble]', guide) : null;
let bubbleTimer = 0;
function guideSay(pose: string, text: string) {
  if (!guide || !guideLuni || !bubble) return;
  if (guideLuni.dataset.pose !== pose || bubble.textContent !== text) {
    guideLuni.dataset.pose = pose;
    bubble.textContent = text;
    guide.classList.remove('talk'); void guide.offsetWidth; guide.classList.add('talk');
    clearTimeout(bubbleTimer); bubbleTimer = window.setTimeout(() => guide.classList.remove('talk'), 4200);
    const api = (guideLuni as any).__lunita;
    if (api) {
      if (pose === 'celebra') api.celebrate(true);
      else { if (guide.dataset.party) api.celebrate(false); api.tap(); }
      guide.dataset.party = pose === 'celebra' ? '1' : '';
    }
  }
}
if (guide) {
  const hero = $('[data-hero]');
  new IntersectionObserver(([e]) => guide.classList.toggle('show', !e.isIntersecting), { threshold: 0.15 }).observe(hero!);
  const sections = $$('[data-guide]').filter((s) => !s.closest('[data-hero]'));
  const sio = new IntersectionObserver((es) => {
    const vis = es.filter((x) => x.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!vis) return;
    const [pose, text] = (vis.target as HTMLElement).dataset.guide!.split('|');
    guideSay(pose, text);
  }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.01] });
  sections.forEach((s) => sio.observe(s));
  guide.addEventListener('click', () => guide.classList.add('talk'));
}

/* ---------- Avión de los viajes: respeta movimiento reducido ---------- */
if (reduce) $$<SVGSVGElement>('.route-svg').forEach((s) => s.pauseAnimations?.());

/* ---------- Encabezado: sombra al hacer scroll ---------- */
const top = $('[data-top]');
addEventListener('scroll', () => top?.classList.toggle('scrolled', scrollY > 10), { passive: true });
