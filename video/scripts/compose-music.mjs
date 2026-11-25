/**
 * Música original para el video "Matrículas 2027 — Liceo Lunita de Chía".
 * Composición propia sintetizada desde cero (sin muestras ni pistas de terceros): libre de derechos.
 *
 * 120 BPM · Do mayor · progresión I–V–vi–IV · 29 s (870 cuadros a 30 fps; 1 compás = 2 s = 60 cuadros).
 *   compases 0–1  intro: pad + campanitas + subida (Lunita se dibuja)
 *   compases 2–11 groove: bombo, palmas, shaker, bajo y marimba con la melodía
 *   compases 12–13 cierre suave (CTA) · compás 14 acorde final que se apaga
 * También genera los efectos: whoosh (transiciones), pop (entradas) y chime (destellos).
 *
 * Uso: node scripts/compose-music.mjs  →  public/audio/*.wav
 */
import fs from 'node:fs';
import path from 'node:path';

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const STEP = BEAT / 4;
const DUR = 29;
const N = Math.round(SR * DUR);
const OUT = path.resolve('public/audio');
fs.mkdirSync(OUT, { recursive: true });

// ---------- utilidades ----------
let seed = 20271;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const TAU = Math.PI * 2;
const bus = () => ({ L: new Float32Array(N), R: new Float32Array(N) });
const music = bus();
const verbSend = bus();

function add(b, i, v, pan = 0) {
  if (i < 0 || i >= N) return;
  const l = Math.cos((pan + 1) * Math.PI / 4), r = Math.sin((pan + 1) * Math.PI / 4);
  b.L[i] += v * l; b.R[i] += v * r;
}

/** Nota tonal genérica: fn(t, f) devuelve la muestra; env(t) la envolvente. */
function note(b, t0, len, fn, env, gain, pan = 0, send = 0) {
  const s0 = Math.round(t0 * SR), n = Math.round(len * SR);
  for (let k = 0; k < n; k++) {
    const t = k / SR, v = fn(t) * env(t) * gain;
    add(b, s0 + k, v, pan);
    if (send) add(verbSend, s0 + k, v * send, pan);
  }
}
const expDecay = (d) => (t) => Math.exp(-t / d) * Math.min(1, t / 0.003);

// ---------- instrumentos ----------
function marimba(t0, m, vel = 1, pan = -0.15) {
  const f = mtof(m);
  note(music, t0, 1.2, (t) => Math.sin(TAU * f * t) + 0.32 * Math.sin(TAU * f * 4 * t) * Math.exp(-t / 0.05) + 0.08 * Math.sin(TAU * f * 10 * t) * Math.exp(-t / 0.012),
    expDecay(0.32), 0.24 * vel, pan, 0.35);
}
function glock(t0, m, vel = 1, pan = 0.3) {
  const f = mtof(m);
  note(music, t0, 1.4, (t) => Math.sin(TAU * f * t) + 0.4 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t / 0.18),
    expDecay(0.45), 0.075 * vel, pan, 0.6);
}
function bass(t0, m, len = STEP * 3, vel = 1) {
  const f = mtof(m);
  note(music, t0, len + 0.08, (t) => {
    const ph = TAU * f * t * (1 + 0.02 * Math.exp(-t / 0.02));
    return Math.sin(ph) + 0.35 * Math.sin(2 * ph) + 0.12 * Math.sin(3 * ph);
  }, (t) => Math.min(1, t / 0.004) * Math.exp(-t / 0.22) * (t > len ? Math.exp(-(t - len) / 0.02) : 1), 0.3 * vel, 0, 0);
}
function pad(t0, notes, len, vel = 1) {
  for (const [j, m] of notes.entries()) {
    const f = mtof(m);
    for (const det of [-0.12, 0.12]) {
      const fd = f * 2 ** (det / 12);
      note(music, t0, len + 0.6, (t) => Math.sin(TAU * fd * t) + 0.25 * Math.sin(TAU * fd * 2 * t) + 0.08 * Math.sin(TAU * fd * 3 * t),
        (t) => Math.min(1, t / 0.35) * (t > len ? Math.exp(-(t - len) / 0.25) : 1), 0.026 * vel, det < 0 ? -0.55 + j * 0.05 : 0.55 - j * 0.05, 0.5);
    }
  }
}
function kick(t0, vel = 1) {
  let ph = 0;
  note(music, t0, 0.4, (t) => { ph += TAU * (48 + 110 * Math.exp(-t / 0.035)) / SR; return Math.sin(ph); },
    (t) => Math.min(1, t / 0.002) * Math.exp(-t / 0.16), 0.5 * vel);
}
function clap(t0, vel = 1) {
  let prev = 0;
  for (const off of [0, 0.011, 0.022]) {
    note(music, t0 + off, 0.22, () => { const x = rnd(); const y = x - prev; prev = x; return y; },
      (t) => Math.exp(-t / (off === 0.022 ? 0.09 : 0.012)), 0.11 * vel, 0.08, 0.4);
  }
}
function shaker(t0, vel = 1, pan = 0.25) {
  let prev = 0;
  note(music, t0, 0.08, () => { const x = rnd(); const y = x - prev; prev = x; return y; },
    (t) => Math.min(1, t / 0.006) * Math.exp(-t / 0.025), 0.05 * vel, pan, 0.1);
}
function riser(t0, len, vel = 1) {
  let lp = 0;
  note(music, t0, len, (t) => { const c = 0.02 + 0.5 * (t / len) ** 2; lp += c * (rnd() - lp); return lp * 3; },
    (t) => (t / len) ** 2.2, 0.12 * vel, 0, 0.5);
}

// ---------- partitura ----------
const CH = {
  C: { pad: [60, 64, 67], bass: 36 },
  G: { pad: [59, 62, 67], bass: 43 },
  Am: { pad: [57, 60, 64], bass: 45 },
  F: { pad: [57, 60, 65], bass: 41 },
};
const PROG = ['C', 'G', 'Am', 'F'];
const chordAt = (bar) => (bar >= 14 ? 'C' : PROG[bar % 4]);

// Melodía principal (pasos de semicorchea: [paso, nota, duración])
const PHRASE = [
  [[0, 64], [2, 67], [4, 72], [6, 67], [8, 69], [10, 67], [12, 64], [14, 62]],
  [[0, 62], [2, 67], [4, 71], [8, 74], [10, 71], [12, 67]],
  [[0, 72], [2, 71], [4, 69], [6, 64], [8, 69], [10, 72], [12, 76]],
  [[0, 77], [2, 76], [4, 72], [6, 69], [8, 67], [10, 65], [12, 64], [14, 62]],
];
const ENDING = [
  [[0, 64], [4, 67], [8, 72]],
  [[0, 71], [4, 69], [6, 67], [8, 74]],
];

for (let bar = 0; bar < 15; bar++) {
  const t = bar * BAR;
  const ch = CH[chordAt(bar)];
  const at = (step) => t + step * STEP;

  // Pad en todo el tema (más suave en la intro y el cierre)
  if (bar < 14) pad(t, ch.pad, BAR, bar < 2 ? 2 : bar >= 12 ? 1.1 : 1);

  if (bar < 2) {
    // Intro: campanitas arpegiadas
    const arp = [...ch.pad, ch.pad[1] + 12, ch.pad[2] + 12, ch.pad[0] + 12, ch.pad[2], ch.pad[1]];
    arp.forEach((m, k) => { glock(at(k * 2), m + 12, 1.6 + 0.15 * k); marimba(at(k * 2), m, 0.35 + 0.05 * k, 0.1); });
    if (bar === 1) {
      riser(t + BEAT * 1.5, BEAT * 2.5);
      [12, 13, 14, 15].forEach((s, k) => clap(at(s), 0.35 + 0.18 * k));
    }
    continue;
  }

  if (bar >= 2 && bar < 12) {
    // Batería
    kick(at(0)); kick(at(8)); if (bar % 2) kick(at(11), 0.55);
    clap(at(4)); clap(at(12));
    for (let s = 2; s < 16; s += 4) shaker(at(s), 1);
    for (let s = 1; s < 16; s += 2) shaker(at(s), 0.45, -0.25);
    if (bar === 9) [12, 13, 14, 15].forEach((s, k) => clap(at(s), 0.4 + 0.15 * k)); // relleno antes de las fechas
    if (bar === 10 || bar === 11) { clap(at(14), 0.6); clap(at(15), 0.8); } // fiesta (fechas)

    // Bajo con síncopa
    const r = ch.bass;
    bass(at(0), r); bass(at(3), r, STEP * 2, 0.8); bass(at(6), r + 12, STEP, 0.6); bass(at(8), r); bass(at(11), r + 7, STEP * 2, 0.8); bass(at(14), r + 12, STEP, 0.6);

    // Melodía (marimba) con eco de campanita una octava arriba
    const inPhrase = (bar >= 2 && bar < 6) || (bar >= 8 && bar < 12);
    if (inPhrase) {
      for (const [s, m] of PHRASE[(bar - 2) % 4]) { marimba(at(s), m); glock(at(s), m + 12, 0.45); }
    } else {
      // Respuesta: arpegios rápidos (STHEAMI y beneficios)
      const tones = [...ch.pad, ch.pad[0] + 12];
      for (let s = 0; s < 16; s += 2) marimba(at(s), tones[(s / 2) % 4] + 12 * (s >= 8 ? 1 : 0) - 0, 0.75, 0.2);
    }
  }

  if (bar >= 12 && bar < 14) {
    // Cierre: bombo suave en 1 y 3, melodía que resuelve
    kick(at(0), 0.7); kick(at(8), 0.5);
    clap(at(12), 0.5);
    for (let s = 2; s < 16; s += 4) shaker(at(s), 0.7);
    bass(at(0), ch.bass, STEP * 6); bass(at(8), ch.bass, STEP * 6, 0.8);
    for (const [s, m] of ENDING[bar - 12]) { marimba(at(s), m); glock(at(s), m + 12, 0.5); }
  }

  if (bar === 14) {
    // Acorde final que se apaga
    kick(t, 0.8);
    bass(t, 36, 0.8);
    for (const m of [60, 64, 67, 72]) marimba(t, m, 0.9);
    [72, 76, 79, 84].forEach((m, k) => glock(t + k * 0.06, m + 12, 0.8));
    pad(t, [60, 64, 67], 0.6, 0.9);
  }
}

// ---------- reverb (Schroeder) ----------
function reverb(inp) {
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d, buf: new Float32Array(d), i: 0 }));
  const aps = [225, 556].map((d) => ({ d, buf: new Float32Array(d), i: 0 }));
  const out = new Float32Array(N);
  for (let n = 0; n < N; n++) {
    let s = 0;
    for (const c of combs) { const y = c.buf[c.i]; c.buf[c.i] = inp[n] + y * 0.78; c.i = (c.i + 1) % c.d; s += y; }
    s *= 0.25;
    for (const a of aps) { const d = a.buf[a.i]; const y = -0.5 * s + d; a.buf[a.i] = s + 0.5 * y; a.i = (a.i + 1) % a.d; s = y; }
    out[n] = s;
  }
  return out;
}
const vL = reverb(verbSend.L), vR = reverb(verbSend.R);
for (let n = 0; n < N; n++) { music.L[n] += vL[n] * 0.28; music.R[n] += vR[n] * 0.28; }

// ---------- master: fade final, limitador suave, normalización ----------
function master(b, fadeOut = 0.7) {
  const len = b.L.length;
  let peak = 0;
  for (let n = 0; n < len; n++) {
    const tl = (len - n) / SR;
    const g = tl < fadeOut ? (tl / fadeOut) ** 1.5 : 1;
    b.L[n] = Math.tanh(b.L[n] * 1.5 * g); b.R[n] = Math.tanh(b.R[n] * 1.5 * g);
    peak = Math.max(peak, Math.abs(b.L[n]), Math.abs(b.R[n]));
  }
  const k = 0.89 / (peak || 1);
  for (let n = 0; n < len; n++) { b.L[n] *= k; b.R[n] *= k; }
}
function writeWav(file, b) {
  const len = b.L.length, data = Buffer.alloc(len * 4);
  for (let n = 0; n < len; n++) {
    data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(b.L[n] * 32767))), n * 4);
    data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(b.R[n] * 32767))), n * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(path.join(OUT, file), Buffer.concat([h, data]));
  console.log('✓', file, (len / SR).toFixed(2) + 's');
}
master(music);
writeWav('music.wav', music);

// ---------- efectos ----------
function sfx(len, fn) {
  const n = Math.round(len * SR), b = { L: new Float32Array(n), R: new Float32Array(n) };
  for (let k = 0; k < n; k++) { const [l, r] = fn(k / SR, k); b.L[k] = l; b.R[k] = r; }
  return b;
}
{ // whoosh: ruido filtrado que barre de izquierda a derecha
  let lp = 0, lp2 = 0; const len = 0.55;
  const b = sfx(len, (t) => { const p = t / len; const c = 0.03 + 0.35 * Math.sin(Math.PI * p) ** 2; lp += c * (rnd() - lp); lp2 += c * (lp - lp2); const e = Math.sin(Math.PI * p) ** 2; return [lp2 * e * (1 - p * 0.6) * 4, lp2 * e * (0.4 + p * 0.6) * 4]; });
  master(b, 0.05); writeWav('whoosh.wav', b);
}
{ // pop: burbuja con caída de tono
  let ph = 0;
  const b = sfx(0.22, (t) => { ph += TAU * (900 * Math.exp(-t / 0.03) + 260) / SR; const v = Math.sin(ph) * Math.exp(-t / 0.05) * Math.min(1, t / 0.002); return [v, v]; });
  master(b, 0.02); writeWav('pop.wav', b);
}
{ // chime: destello ascendente
  const notes = [84, 88, 91, 96];
  const b = sfx(1.4, (t) => {
    let v = 0;
    notes.forEach((m, k) => { const tt = t - k * 0.055; if (tt > 0) { const f = mtof(m); v += (Math.sin(TAU * f * tt) + 0.3 * Math.sin(TAU * f * 2.76 * tt)) * Math.exp(-tt / 0.35) * 0.3; } });
    return [v * 0.9, v];
  });
  master(b, 0.2); writeWav('chime.wav', b);
}
