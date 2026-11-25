/**
 * "Matrículas 2027 — Liceo Lunita de Chía": motion graphics con Lunita como protagonista.
 * Una sola composición que se adapta a 16:9 (landing) y 9:16 (pauta): Lunita vive en una capa propia
 * y viaja entre escenas (sin cortes duros); el contenido de cada escena entra y sale sobre el ritmo (120 BPM).
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AccWindow, Lunita } from "./components/Lunita";
import { Button, Chip, FlatShape, Grain, IconCalendar, IconPhone, IconPlane, IconWhatsapp, Kicker, PhotoCard, Rise, ShapeKind, StickerWord, useExit, useSpring, Vignette, Words } from "./components/ui";
import { BEAT, DATA, SCENES, STHEAMI, theme, TOTAL } from "./theme";

const C = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type P = [number, number, number]; // centro x, centro y, tamaño de la caja de Lunita

// ------------------------------------------------------------ Diseños --
type Layout = {
  v: boolean;
  luni: { hook: P; promise: P; stheami: P; benefits: P; dates: P; cta: P };
  pins: [number, number][]; // puntos del recorrido (pies de Lunita)
  travelSize: number;
  shapes: { k: ShapeKind; c: string; d: string; x: number; y: number; w: number; r: number }[];
  orbit: [number, number, number]; // centro y escala de las órbitas
};

const LANDSCAPE: Layout = {
  v: false,
  luni: { hook: [960, 330, 540], promise: [470, 560, 680], stheami: [960, 320, 460], benefits: [1730, 870, 320], dates: [480, 560, 640], cta: [470, 560, 620] },
  pins: [[230, 830], [520, 670], [810, 830], [1100, 670], [1390, 830], [1680, 670]],
  travelSize: 250,
  shapes: [
    { k: "moon", c: C.yellow, d: C.yellowD, x: -70, y: 70, w: 270, r: -12 },
    { k: "planet", c: C.sky, d: C.skyD, x: 1690, y: 40, w: 270, r: 0 },
    { k: "hill", c: C.green, d: C.greenD, x: -90, y: 560, w: 220, r: 0 },
    { k: "star", c: C.blue, d: C.blueD, x: 120, y: 860, w: 190, r: 10 },
    { k: "rombo", c: C.orange, d: C.orangeD, x: 1760, y: 500, w: 150, r: 8 },
    { k: "sun", c: C.purple, d: C.purpleD, x: 1700, y: 860, w: 240, r: 0 },
  ],
  orbit: [960, 330, 1],
};

const VERTICAL: Layout = {
  v: true,
  luni: { hook: [540, 620, 620], promise: [540, 520, 520], stheami: [540, 500, 470], benefits: [870, 1585, 290], dates: [540, 560, 560], cta: [540, 540, 540] },
  pins: [[250, 740], [820, 905], [260, 1070], [820, 1235], [260, 1400], [820, 1565]],
  travelSize: 250,
  shapes: [
    { k: "moon", c: C.yellow, d: C.yellowD, x: -90, y: 150, w: 260, r: -12 },
    { k: "planet", c: C.sky, d: C.skyD, x: 860, y: 120, w: 260, r: 0 },
    { k: "star", c: C.blue, d: C.blueD, x: -60, y: 1640, w: 220, r: 10 },
    { k: "sun", c: C.purple, d: C.purpleD, x: 860, y: 1660, w: 260, r: 0 },
  ],
  orbit: [540, 620, 0.9],
};

const DEST = [
  { t: "Chía", c: C.yellow, d: C.yellowD, fg: C.navy },
  { t: "Canadá", c: C.red, d: C.redD, fg: C.white },
  { t: "Europa", c: C.blue, d: C.blueD, fg: C.white },
  { t: "Londres", c: C.purple, d: C.purpleD, fg: C.white },
  { t: "China", c: C.orange, d: C.orangeD, fg: C.white },
  { t: "Cuba", c: C.green, d: C.greenD, fg: C.white },
];
const PIN_STEP = 16; // cuadros entre destino y destino
const TRAVEL_GO = SCENES.travel.from + 10;
const pinTime = (j: number) => TRAVEL_GO + j * PIN_STEP;

/** Lunita, a partir de los pies, está 0,41·tamaño por debajo del centro de su caja. */
const footToCenter = (x: number, y: number, s: number): P => [x, y - s * 0.41, s];

// ---------------------------------------------------- Coreografía de Lunita --
const HOPS = [104, 150, 180, 210, 242, 362, 482, ...[1, 2, 3, 4, 5].map((j) => pinTime(j) - 6), 602, 808];
const HELLOS = [730, 846];
const PARTY: [number, number][] = [[612, 716]];
const ACC: AccWindow[] = [
  { pose: "hola", from: 50, to: 118 },
  { pose: "estudio", from: 132, to: 238 },
  { pose: "stheami", from: 246, to: 358 },
  { pose: "musica", from: 366, to: 478 },
  { pose: "viaje", from: 486, to: 598 },
  { pose: "celebra", from: 606, to: 718 },
  { pose: "contacto", from: 728, to: TOTAL + 20 },
  { pose: "admisiones", from: 742, to: TOTAL + 20 },
];

function luniKeys(L: Layout): [number, P, keyof typeof theme.spring][] {
  const t = L.travelSize;
  return [
    [0, L.luni.hook, "glide"],
    [SCENES.promise.from - 6, L.luni.promise, "glide"],
    [SCENES.stheami.from - 6, L.luni.stheami, "glide"],
    [SCENES.benefits.from - 6, L.luni.benefits, "glide"],
    [SCENES.travel.from - 6, footToCenter(L.pins[0][0], L.pins[0][1], t), "glide"],
    ...[1, 2, 3, 4, 5].map((j) => [pinTime(j) - 8, footToCenter(L.pins[j][0], L.pins[j][1], t), "smooth"] as [number, P, keyof typeof theme.spring]),
    [SCENES.dates.from - 6, L.luni.dates, "glide"],
    [SCENES.cta.from - 6, L.luni.cta, "glide"],
  ];
}
function luniAt(frame: number, fps: number, L: Layout): P {
  const keys = luniKeys(L);
  let [x, y, s] = keys[0][1];
  for (const [t, p, cfg] of keys.slice(1)) {
    const k = spring({ frame: frame - t, fps, config: theme.spring[cfg] });
    x += (p[0] - x) * k; y += (p[1] - y) * k; s += (p[2] - s) * k;
  }
  return [x, y, s];
}

const LunitaLayer: React.FC<{ L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [x, y, s] = luniAt(frame, fps, L);
  const [px] = luniAt(frame - 1, fps, L);
  const tilt = Math.max(-14, Math.min(14, (x - px) * 0.35));
  return (
    <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2 }}>
      <Lunita frame={frame} size={s} introAt={6} hops={HOPS} hellos={HELLOS} party={PARTY} acc={ACC} tilt={tilt} />
    </div>
  );
};

// --------------------------------------------------------------- Fondo --
const Backdrop: React.FC<{ L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const maxR = Math.hypot(width, height) * 1.05;
  const wipe = (at: number, [x, y]: P, color: string) => {
    const p = spring({ frame: frame - at, fps, config: { damping: 22, stiffness: 70, mass: 1 } });
    return p > 0.001 ? <div style={{ position: "absolute", left: x - maxR, top: y - maxR, width: maxR * 2, height: maxR * 2, borderRadius: "50%", background: color, transform: `scale(${p})` }} /> : null;
  };
  const [ox, oy, os] = L.orbit;
  const boundaries: number[] = Object.values(SCENES).map((s) => s.from as number).slice(1);
  return (
    <AbsoluteFill style={{ background: C.ivory, overflow: "hidden" }}>
      {wipe(SCENES.dates.from - 4, L.luni.dates, C.yellow)}
      {wipe(SCENES.cta.from - 4, L.luni.cta, C.ivory)}

      {/* Órbitas que se dibujan al entrar */}
      <svg style={{ position: "absolute", left: ox - 1000, top: oy - 1000, width: 2000, height: 2000, overflow: "visible" }} viewBox="-1000 -1000 2000 2000">
        {[150, 250, 370, 510, 680, 870].map((r, o) => {
          const d = interpolate(frame, [10 + o * 5, 52 + o * 5], [1, 0], { ...clamp, easing: theme.ease.out });
          return <circle key={o} r={r * os} fill="none" stroke={o === 2 ? "rgba(48,50,150,.22)" : `rgba(15,23,71,${o % 2 ? 0.07 : 0.1})`} strokeWidth={o === 2 ? 3 : 1.8} pathLength={1} strokeDasharray={o === 2 ? "0.002 0.012" : "1 1"} strokeDashoffset={o === 2 ? 0 : d} strokeLinecap="round" opacity={o === 2 ? interpolate(frame, [30, 60], [0, 1], clamp) : 1} />;
        })}
        {[[250, 46, C.yellow, 16, 0], [510, -80, C.sky, 22, -90], [680, 120, C.green, 12, 180]].map(([r, t, c, z, a0], k) => {
          const a = ((Number(a0) + (frame / (Math.abs(Number(t)) * 30)) * 360 * Math.sign(Number(t))) * Math.PI) / 180;
          return <circle key={k} cx={Math.cos(a) * Number(r) * os} cy={Math.sin(a) * Number(r) * os} r={Number(z) / 2 + 2} fill={String(c)} opacity={interpolate(frame, [40, 64], [0, 1], clamp)} />;
        })}
      </svg>

      {/* Figuras planas del mundo Lunita: entran, flotan y giran en cada cambio de escena */}
      {L.shapes.map((s, i) => {
        const pop = spring({ frame: frame - 12 - i * 4, fps, config: theme.spring.bouncy });
        const kick = boundaries.reduce((acc, b, j) => acc + spring({ frame: frame - b + 2, fps, config: theme.spring.snappy }) * (j % 2 ? -1 : 1) * (i % 2 ? 14 : -14), 0);
        const bump = boundaries.reduce((acc, b) => acc + interpolate(frame - b, [-2, 5, 16], [0, 1, 0], { ...clamp, easing: theme.ease.out }), 0);
        const float = Math.sin((frame + i * 39) / 34) * 12;
        return (
          <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: s.w, height: s.w, transform: `translateY(${float}px) rotate(${s.r + kick + Math.sin((frame + i * 20) / 50) * 4}deg) scale(${pop * (1 + bump * 0.07)})` }}>
            <FlatShape k={s.k} c={s.c} d={s.d} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Envoltura de escena: salida rápida y uniforme. */
const Scene: React.FC<{ dur: number; exit?: boolean; children: React.ReactNode }> = ({ dur, exit = true, children }) => {
  const ex = useExit(dur);
  const e = exit ? ex : 0;
  return <AbsoluteFill style={{ opacity: 1 - e, transform: `translateY(${-50 * e}px) scale(${1 - 0.03 * e})` }}>{children}</AbsoluteFill>;
};

const Abs: React.FC<{ x: number; y: number; w?: number; align?: "left" | "center"; children: React.ReactNode }> = ({ x, y, w, align = "left", children }) => (
  <div style={{ position: "absolute", left: align === "center" ? x - (w ?? 0) / 2 : x, top: y, width: w, textAlign: align, display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start" }}>{children}</div>
);

// --------------------------------------------------------------- Escenas --
const LEVELS = [
  { t: "Jardín", c: C.orange, d: C.orangeD, fg: C.white },
  { t: "Transición", c: C.yellow, d: C.yellowD, fg: C.navy },
  { t: "Primaria", c: C.green, d: C.greenD, fg: C.white },
  { t: "Bachillerato", c: C.sky, d: C.skyD, fg: C.white },
];

const Hook: React.FC<{ L: Layout }> = ({ L }) => {
  const v = L.v;
  return (
    <Scene dur={SCENES.hook.dur}>
      <Abs x={v ? 540 : 960} y={v ? 975 : 610} w={v ? 1000 : 1700} align="center">
        <div style={{ display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", gap: v ? 18 : 34 }}>
          <Words text={v ? "Matrículas\n2027" : "Matrículas 2027"} size={v ? 140 : 150} delay={50} per={4} style={{ justifyContent: "center" }} />
          <StickerWord text="¡abiertas!" c={C.yellow} d={C.yellowD} size={v ? 120 : 132} delay={64} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: v ? 18 : 22, marginTop: v ? 56 : 44, maxWidth: v ? 900 : 1400 }}>
          {LEVELS.map((l, i) => <Chip key={l.t} text={l.t} c={l.c} d={l.d} fg={l.fg} size={v ? 46 : 40} delay={80 + i * 4} />)}
        </div>
      </Abs>
    </Scene>
  );
};

const WORDS = [
  { t: "luz propia", c: C.yellow, d: C.yellowD, fg: C.navy },
  { t: "ciencia", c: C.sky, d: C.skyD, fg: C.white },
  { t: "arte", c: C.pink, d: C.pinkD, fg: C.white },
  { t: "música", c: C.purple, d: C.purpleD, fg: C.white },
];
const RotWord: React.FC<{ size: number; at: number[]; center?: boolean }> = ({ size, at, center }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", height: size * 1.25, width: "100%" }}>
      {WORDS.map((w, i) => {
        const start = at[i], end = at[i + 1] ?? 1e9;
        const pin = spring({ frame: frame - start, fps, config: theme.spring.bouncy });
        const out = interpolate(frame, [end, end + 8], [0, 1], { ...clamp, easing: theme.ease.in });
        if (frame < start || out >= 1) return null;
        return (
          <span key={w.t} style={{ position: "absolute", left: center ? "50%" : 0, top: 0, translate: center ? "-50% 0" : undefined, padding: `0 ${size * 0.22}px ${size * 0.04}px`, borderRadius: size * 0.24, background: w.c, color: w.fg, boxShadow: `0 ${size * 0.09}px 0 ${w.d}`,
            fontSize: size, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.12, whiteSpace: "nowrap", opacity: Math.min(1, pin * 2) * (1 - out),
            transform: `translateY(${interpolate(pin, [0, 1], [size * 0.7, 0]) - out * size * 0.7}px) rotate(${interpolate(pin, [0, 1], [-6, -1.5]) + out * 4}deg) scale(${interpolate(pin, [0, 1], [0.85, 1])})` }}>
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

const Stairs: React.FC<{ w: number; base: number; delay: number; size: number }> = ({ w, base, delay, size }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: base * 2.7 }}>
    {LEVELS.map((l, i) => {
      const p = useSpring(delay + i * 6, "bouncy");
      const h = base * (1 + i * 0.55);
      return (
        <div key={l.t} style={{ width: w, height: h, borderRadius: 26, background: l.c, boxShadow: `0 10px 0 ${l.d}`, color: l.fg, fontSize: size, fontWeight: 900, display: "flex", justifyContent: "center", paddingTop: size * 0.5,
          transformOrigin: "bottom", transform: `scaleY(${p})`, opacity: Math.min(1, p * 2) }}>
          <span style={{ transform: `scaleY(${p > 0.05 ? 1 / Math.max(p, 0.05) : 1})`, transformOrigin: "top", whiteSpace: "nowrap" }}>{l.t}</span>
        </div>
      );
    })}
  </div>
);

const Promise: React.FC<{ L: Layout }> = ({ L }) => {
  const v = L.v;
  const at = [14, 30, 60, 90];
  return (
    <Scene dur={SCENES.promise.dur}>
      <Abs x={v ? 540 : 930} y={v ? 830 : 170} w={v ? 940 : 920} align={v ? "center" : "left"}>
        <Words text={v ? "Donde cada\nestudiante brilla con" : "Donde cada\nestudiante brilla con"} size={v ? 88 : 96} delay={4} per={3} style={{ justifyContent: v ? "center" : "flex-start" }} />
        <div style={{ marginTop: 14, width: v ? 520 : "100%", alignSelf: v ? "center" : "flex-start" }}><RotWord size={v ? 104 : 112} at={at} center={v} /></div>
        <div style={{ marginTop: v ? 60 : 58 }}><Stairs w={v ? 205 : 214} base={v ? 92 : 84} delay={36} size={v ? 30 : 30} /></div>
        <Rise delay={56}><div style={{ marginTop: 26, fontSize: v ? 40 : 38, fontWeight: 800, color: C.muted }}>De Jardín a Bachillerato, en un mismo colegio</div></Rise>
      </Abs>
    </Scene>
  );
};

const Stheami: React.FC<{ L: Layout }> = ({ L }) => {
  const v = L.v;
  const tile = v ? 196 : 162;
  const rows = v ? [STHEAMI.slice(0, 4), STHEAMI.slice(4)] : [STHEAMI];
  return (
    <Scene dur={SCENES.stheami.dur}>
      <Abs x={v ? 540 : 960} y={v ? 830 : 590} w={v ? 1000 : 1600} align="center">
        <Kicker text="Nuestro modelo pedagógico" delay={8} size={v ? 34 : 30} />
        {rows.map((row, r) => (
          <div key={r} style={{ display: "flex", gap: v ? 24 : 22, marginTop: r ? 26 : 26 }}>
            {row.map((s, k) => {
              const idx = r * 4 + k;
              return (
                <div key={s.k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <StickerWord text={s.k} c={s.c} d={s.d} fg={s.k === "M" ? C.navy : C.white} size={tile * 0.62} delay={14 + idx * 6} rot={idx % 2 ? 3 : -3}
                    style={{ width: tile, height: tile, display: "grid", placeItems: "center", padding: 0, borderRadius: tile * 0.28, boxShadow: `0 ${tile * 0.07}px 0 ${s.d}` }} />
                  <Rise delay={20 + idx * 6} y={16}><div style={{ fontSize: v ? 31 : 26, fontWeight: 800, color: C.navy }}>{s.name}</div></Rise>
                </div>
              );
            })}
          </div>
        ))}
        <Rise delay={62}><div style={{ marginTop: v ? 44 : 34, fontSize: v ? 42 : 38, fontWeight: 800, color: C.muted, maxWidth: v ? 900 : 1400 }}>Proyectos interdisciplinarios para aprender haciendo</div></Rise>
      </Abs>
    </Scene>
  );
};

const Benefits: React.FC<{ L: Layout }> = ({ L }) => {
  const v = L.v;
  const dur = SCENES.benefits.dur;
  const label = (text: string, c: string, d: string, delay: number) => (
    <div style={{ position: "absolute", left: -24, top: -38 }}><Chip text={text} c={c} d={d} size={v ? 40 : 36} delay={delay} /></div>
  );
  return (
    <Scene dur={dur}>
      <div style={{ position: "absolute", left: v ? 90 : 170, top: v ? 300 : 150 }}>
        <PhotoCard src="img/festival-bandas.jpg" w={v ? 900 : 860} h={v ? 560 : 520} delay={4} rot={-3} dur={dur}>
          {label("Banda marcial y Festival Internacional", C.purple, C.purpleD, 14)}
        </PhotoCard>
      </div>
      <div style={{ position: "absolute", left: v ? 110 : 1010, top: v ? 960 : 400 }}>
        <PhotoCard src="img/bachillerato.jpg" w={v ? 860 : 700} h={v ? 520 : 460} delay={28} rot={3} dur={dur} zoomIn={false}>
          {label("Convenio de bachillerato internacional", C.sky, C.skyD, 38)}
        </PhotoCard>
      </div>
    </Scene>
  );
};

const Travel: React.FC<{ L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame(); // local
  const { fps } = useVideoConfig();
  const v = L.v;
  const local = (g: number) => g - SCENES.travel.from;
  const pts = L.pins;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let j = 1; j < pts.length; j++) {
    const [x0, y0] = pts[j - 1], [x1, y1] = pts[j];
    const lift = v ? 0 : -90;
    d += ` C${x0 + (x1 - x0) * 0.35} ${(y0 + y1) / 2 + lift + (v ? 0 : 0)} ${x0 + (x1 - x0) * 0.65} ${(y0 + y1) / 2 + lift} ${x1} ${y1}`;
  }
  const reveal = interpolate(frame, [local(TRAVEL_GO) - 6, local(pinTime(5))], [1, 0], { ...clamp, easing: theme.ease.soft });
  return (
    <Scene dur={SCENES.travel.dur}>
      <Abs x={v ? 540 : 960} y={v ? 250 : 110} w={v ? 980 : 1700} align="center">
        <Kicker text="Viajes de promoción" color={C.blue} delay={2} size={v ? 34 : 30} />
        <div style={{ height: 14 }} />
        <Words text={"Nuestras promociones\nhan recorrido el mundo"} size={v ? 86 : 92} delay={6} per={3} style={{ justifyContent: "center" }} />
      </Abs>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <mask id="route" maskUnits="userSpaceOnUse">
            <path d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth={30} strokeDasharray="1 1" strokeDashoffset={reveal} />
          </mask>
        </defs>
        <path d={d} fill="none" stroke={C.blue} strokeOpacity={0.45} strokeWidth={9} strokeLinecap="round" strokeDasharray="0.1 24" mask="url(#route)" />
      </svg>
      {pts.map(([x, y], j) => {
        const p = spring({ frame: frame - local(pinTime(j)) + (j === 0 ? 8 : 2), fps, config: theme.spring.bouncy });
        const dd = DEST[j];
        const side = v ? (x < 540 ? "right" : "left") : "below";
        return (
          <div key={j} style={{ position: "absolute", left: x, top: y }}>
            <div style={{ position: "absolute", left: -20, top: -10, width: 40, height: 20, borderRadius: "50%", background: dd.c, boxShadow: `0 5px 0 ${dd.d}`, transform: `scale(${p})` }} />
            <div style={{ position: "absolute", ...(side === "below" ? { left: 0, top: 36, transform: "translateX(-50%)" } : side === "right" ? { left: 44, top: -34 } : { right: 44, top: -34 }) }}>
              <Chip text={dd.t} c={dd.c} d={dd.d} fg={dd.fg} size={v ? 44 : 40} delay={local(pinTime(j)) - (j === 0 ? 8 : 2)} icon={j === 0 ? undefined : <IconPlane size={v ? 40 : 36} color={dd.fg} />} />
            </div>
          </div>
        );
      })}
      <Abs x={v ? 540 : 960} y={v ? 1700 : 965} w={1200} align="center">
        <Rise delay={local(pinTime(5)) + 6} y={24}><div style={{ fontSize: v ? 44 : 40, fontWeight: 900, color: C.blue }}>¡y muchos destinos más!</div></Rise>
      </Abs>
    </Scene>
  );
};

const Dates: React.FC<{ L: Layout }> = ({ L }) => {
  const v = L.v;
  return (
    <Scene dur={SCENES.dates.dur}>
      <Abs x={v ? 540 : 930} y={v ? 930 : 210} w={v ? 1000 : 900} align={v ? "center" : "left"}>
        <Kicker text="Matrículas 2027 abiertas" color={C.navy} delay={10} size={v ? 36 : 34} />
        <Words text="1 al 17" size={v ? 230 : 250} delay={18} per={4} style={{ marginTop: 10, letterSpacing: "-0.05em", justifyContent: v ? "center" : "flex-start" }} />
        <Words text="de diciembre de 2026" size={v ? 84 : 86} delay={26} per={3} style={{ marginTop: 0, justifyContent: v ? "center" : "flex-start" }} />
        <div style={{ marginTop: v ? 54 : 46 }}>
          <Chip text="Inscripción en línea · Plataforma SIGA" c={C.white} d="rgba(15,23,71,.18)" fg={C.navy} size={v ? 38 : 36} delay={46} icon={<IconCalendar size={v ? 46 : 42} />} />
        </div>
      </Abs>
    </Scene>
  );
};

const Cta: React.FC<{ L: Layout }> = ({ L }) => {
  const v = L.v;
  const fs = v ? 50 : 50;
  return (
    <Scene dur={SCENES.cta.dur} exit={false}>
      <Abs x={v ? 540 : 900} y={v ? 900 : 200} w={v ? 1000 : 940} align={v ? "center" : "left"}>
        <Words text={"¡Te esperamos\nen Lunita!"} size={v ? 104 : 112} delay={12} per={3} style={{ justifyContent: v ? "center" : "flex-start" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: v ? "center" : "flex-start", gap: 34, marginTop: v ? 60 : 54 }}>
          <Button c={C.green} d={C.greenD} fg={C.white} size={fs} delay={30}><IconWhatsapp size={fs * 1.3} /> WhatsApp {DATA.whatsapp}</Button>
          <Button c={C.white} d="rgba(15,23,71,.16)" fg={C.navy} size={fs * 0.9} delay={38} border={`3px solid ${C.line}`}><IconPhone size={fs * 1.05} /> {DATA.phone}</Button>
        </div>
        <Rise delay={52}><div style={{ marginTop: v ? 54 : 50, fontSize: v ? 36 : 34, fontWeight: 900, color: C.navy }}>Liceo Lunita de Chía</div></Rise>
        <Rise delay={58}><div style={{ fontSize: v ? 32 : 30, fontWeight: 800, color: C.muted }}>De Jardín a Bachillerato · Chía, Cundinamarca</div></Rise>
      </Abs>
    </Scene>
  );
};

// ------------------------------------------------------------- Audio --
const Sfx: React.FC = () => {
  const whooshes = Object.values(SCENES).map((s) => s.from).slice(1);
  return (
    <>
      <Audio src={staticFile("audio/music.wav")} volume={0.85} />
      {whooshes.map((f) => (
        <Sequence key={`w${f}`} from={f - 6} durationInFrames={20} layout="none"><Audio src={staticFile("audio/whoosh.wav")} volume={0.32} /></Sequence>
      ))}
      <Sequence from={10} durationInFrames={10} layout="none"><Audio src={staticFile("audio/pop.wav")} volume={0.35} /></Sequence>
      <Sequence from={62} durationInFrames={45} layout="none"><Audio src={staticFile("audio/chime.wav")} volume={0.3} /></Sequence>
      {[0, 1, 2, 3, 4, 5].map((j) => (
        <Sequence key={`p${j}`} from={pinTime(j) - 3} durationInFrames={10} layout="none"><Audio src={staticFile("audio/pop.wav")} volume={0.22} /></Sequence>
      ))}
      <Sequence from={SCENES.dates.from + 16} durationInFrames={45} layout="none"><Audio src={staticFile("audio/chime.wav")} volume={0.32} /></Sequence>
      <Sequence from={SCENES.cta.from + 28} durationInFrames={45} layout="none"><Audio src={staticFile("audio/chime.wav")} volume={0.26} /></Sequence>
    </>
  );
};

// ------------------------------------------------------------- Principal --
export const MatriculasVideo: React.FC = () => {
  const { width, height } = useVideoConfig();
  const L = height > width ? VERTICAL : LANDSCAPE;
  const s = SCENES;
  void BEAT;
  return (
    <AbsoluteFill style={{ fontFamily: `${theme.font}, sans-serif`, color: C.ink, overflow: "hidden" }}>
      <Backdrop L={L} />
      <Sequence name="Gancho" from={s.hook.from} durationInFrames={s.hook.dur}><Hook L={L} /></Sequence>
      <Sequence name="Promesa" from={s.promise.from} durationInFrames={s.promise.dur}><Promise L={L} /></Sequence>
      <Sequence name="STHEAMI" from={s.stheami.from} durationInFrames={s.stheami.dur}><Stheami L={L} /></Sequence>
      <Sequence name="Beneficios" from={s.benefits.from} durationInFrames={s.benefits.dur}><Benefits L={L} /></Sequence>
      <Sequence name="Viajes" from={s.travel.from} durationInFrames={s.travel.dur}><Travel L={L} /></Sequence>
      <Sequence name="Fechas" from={s.dates.from} durationInFrames={s.dates.dur}><Dates L={L} /></Sequence>
      <Sequence name="Cierre" from={s.cta.from} durationInFrames={s.cta.dur}><Cta L={L} /></Sequence>
      <LunitaLayer L={L} />
      <Grain />
      <Vignette />
      <Sfx />
    </AbsoluteFill>
  );
};
