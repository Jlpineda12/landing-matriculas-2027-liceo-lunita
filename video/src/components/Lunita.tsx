/**
 * Lunita (personaje 2026) para Remotion: el mismo SVG del sitio, pero animado cuadro a cuadro
 * (sin CSS), para que el render sea determinista. Animaciones portadas de Lunita.astro:
 * intro · reposo · saludo · salto · fiesta, y accesorios por pose que entran y salen con escala.
 */
import React from "react";
import { interpolate, spring, useVideoConfig, EasingFunction } from "remotion";
import { MOON, PLATE, RING, SHADE, SPARK, SSHADE, STAR, TRACE } from "../lunita-paths";
import { theme } from "../theme";

export type Pose = "hola" | "stheami" | "musica" | "estudio" | "contacto" | "celebra" | "admisiones" | "viaje";
export type AccWindow = { pose: Pose; from: number; to: number };

type Props = {
  frame: number;
  introAt?: number;
  hops?: number[];
  hellos?: number[];
  party?: [number, number][];
  acc?: AccWindow[];
  tilt?: number;
  size: number;
};

const C = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const kf = (t: number, stops: number[], values: number[], easing: EasingFunction = theme.ease.soft) =>
  interpolate(t, stops, values, { ...clamp, easing });
const around = (cx: number, cy: number, t: string) => `translate(${cx} ${cy}) ${t} translate(${-cx} ${-cy})`;
const star = (cx: number, cy: number, R: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = ((-90 + i * 36) * Math.PI) / 180, rr = i % 2 ? r : R;
    return `${i ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }).join("") + "Z";

const BURST = [C.yellow, C.sky, C.green, C.pink, C.purple, C.orange, C.yellow, C.sky].map((c, i) => {
  const a = i * 45 + 22.5, t = (a * Math.PI) / 180;
  return { c, a, i, r: Math.round(1 / Math.hypot(Math.sin(t) / 235, Math.cos(t) / 300)) + 20 };
});
const SEVEN = [C.sky, C.green, C.orange, C.purple, C.red, C.yellow, C.pink];
const FAMILY: [number, number, string, number, number][] = [[300, 250, C.sky, 260, -40], [350, 318, C.green, 280, 120], [292, 382, C.pink, 240, 260]];

/** Último evento activo: devuelve cuadros transcurridos o -1. */
const since = (frame: number, starts: number[] = [], len: number) => {
  let best = -1;
  for (const s of starts) if (frame >= s && frame - s < len) best = frame - s;
  return best;
};

export const Lunita: React.FC<Props> = ({ frame, introAt = -999, hops, hellos, party, acc = [], tilt = 0, size }) => {
  const { fps } = useVideoConfig();
  const id = "lun";
  const i = frame - introAt;
  const intro = introAt > -999 && i < 75;
  const visible = introAt <= -999 || i >= 0;

  // ---------- accesorios: visibilidad con resorte ----------
  const vis = (pose: Pose) => {
    let v = 0;
    for (const w of acc) {
      if (w.pose !== pose) continue;
      const vin = spring({ frame: frame - w.from, fps, config: theme.spring.bouncy });
      const vout = kf(frame, [w.to - 9, w.to], [1, 0], theme.ease.in);
      v = Math.max(v, Math.min(vin, vout));
    }
    return Math.max(0, v);
  };
  const accT = (v: number, cx: number, cy: number) => around(cx, cy, `scale(${0.4 + 0.6 * v})`);

  // ---------- cuerpo: salto / saludo / fiesta ----------
  const h = since(frame, hops, 28);
  const hello = since(frame, hellos, 36);
  const partyOn = (party ?? []).some(([a, b]) => frame >= a && frame < b);
  const pt = partyOn ? ((frame - (party ?? []).find(([a, b]) => frame >= a && frame < b)![0]) % 78) / 78 : -1;

  let bodyTy = 0, bodySx = 1, bodySy = 1, bodyRot = 0;
  let moonRot = 0, moonTx = 0, moonTy = 0, moonOrbit = 0, moonScale = 1;
  let starRot = 0, starScale = 1, starTy = 0, shadowS = 1, shadowO = 0.1;

  // Reposo (siempre de base): la luna se mece y la estrella titila
  const th = (2 * Math.PI * frame) / 150;
  moonRot = -3 * Math.cos(th);
  moonTy = -1 + 4 * Math.cos(th);
  const tw = (frame % 102) / 102;
  starScale = kf(tw, [0, 0.62, 0.72, 0.84, 0.92, 1], [1, 1, 0.7, 1.22, 0.96, 1]);
  starRot = kf(tw, [0, 0.62, 0.72, 0.84, 0.92, 1], [0, 0, 25, -12, 4, 0]);

  if (hello >= 0) {
    const p = hello / 36;
    bodyRot = kf(p, [0, 0.25, 0.55, 0.8, 1], [0, -3, 2, -1, 0]);
    moonRot = kf(p, [0, 0.18, 0.4, 0.6, 0.78, 1], [0, -14, 10, -6, 3, 0]);
    moonTx = kf(p, [0, 0.18, 0.4], [0, -6, 0]);
    starTy = kf(p, [0, 0.3, 0.55, 0.75, 1], [0, -26, 0, -8, 0]);
    starRot = kf(p, [0, 0.3, 0.55, 1], [0, -30, 10, 0]);
    starScale = kf(p, [0, 0.3, 0.55, 1], [1, 1.15, 0.9, 1]);
  }
  if (pt >= 0) {
    moonOrbit = kf(pt, [0, 0.12, 0.66, 1], [0, 0, 360, 360], theme.ease.inOut);
    starTy = kf(pt, [0, 0.2, 0.4, 0.72, 0.86, 1], [0, -20, 0, -14, 0, 0]);
    starRot = kf(pt, [0, 0.2, 0.4, 0.72, 0.86, 1], [0, -20, 0, 15, 0, 0]);
    starScale = kf(pt, [0, 0.2, 0.4, 0.72, 0.86, 1], [1, 1.3, 1, 1.2, 1, 1]);
    bodyTy = kf(pt, [0, 0.6, 0.67, 0.76, 0.86, 0.93, 1], [0, 0, 0, -26, 0, 0, 0]);
    bodySx = kf(pt, [0, 0.6, 0.67, 0.76, 0.86, 0.93, 1], [1, 1, 1.05, 0.97, 1.03, 1, 1]);
    bodySy = kf(pt, [0, 0.6, 0.67, 0.76, 0.86, 0.93, 1], [1, 1, 0.95, 1.03, 0.97, 1, 1]);
  }
  if (h >= 0) {
    const p = h / 28;
    const st = [0, 0.14, 0.42, 0.64, 0.8, 1];
    bodyTy = kf(p, st, [0, 0, -70, 0, 0, 0]);
    bodySx = kf(p, st, [1, 1.08, 0.95, 1.08, 0.98, 1]);
    bodySy = kf(p, st, [1, 0.9, 1.06, 0.9, 1.03, 1]);
    moonTy += kf(p, [0, 0.42, 0.66, 1], [0, 10, -8, 0]);
    moonRot += kf(p, [0, 0.42, 0.66, 1], [0, -5, 3, 0]);
    starRot = kf(p, [0, 0.1, 0.55, 1], [0, 0, 200, 360]);
    starScale = kf(p, [0, 0.1, 0.55, 1], [1, 1, 1.25, 1]);
    shadowS = kf(p, [0, 0.42, 0.64, 1], [1, 0.7, 1.08, 1]);
    shadowO = kf(p, [0, 0.42, 0.64, 1], [0.1, 0.05, 0.1, 0.1]);
  }

  // ---------- entrada ----------
  let plateS = 1, plateO = 1, traceOff = 0, shadeO = 1, shadeTx = 0, shadeTy = 0, moonO = 1;
  if (intro) {
    plateS = kf(i, [0, 16], [0.3, 1], theme.ease.back);
    plateO = kf(i, [0, 8], [0, 1]);
    traceOff = kf(i, [4, 37], [1, 0]);
    const mp = kf(i, [15, 45], [0, 1], theme.ease.back);
    moonOrbit = interpolate(mp, [0, 1], [-150, 0]);
    moonScale = interpolate(mp, [0, 1], [0.15, 1]);
    moonO = kf(i, [15, 24], [0, 1]);
    shadeO = kf(i, [34, 52], [0, 1], theme.ease.out);
    shadeTx = kf(i, [34, 52], [-16, 0], theme.ease.out);
    shadeTy = kf(i, [34, 52], [4, 0], theme.ease.out);
    const sp = spring({ frame: i - 37, fps, config: { damping: 9, stiffness: 140, mass: 0.7 } });
    starScale *= sp;
    starRot += interpolate(sp, [0, 1], [-200, 0]);
    shadowO = kf(i, [9, 33], [0, 0.1]);
  }

  // Destellos: en la entrada y en la fiesta
  const burstT = intro ? i - 43 : pt >= 0 ? (pt - 0.64) * 78 : -1;
  const sparks = BURST.map((b) => {
    const t = burstT - b.i;
    const p = t / 28;
    if (t < 0 || p > 1) return null;
    const op = kf(p, [0, 0.3, 1], [0, 1, 0]);
    const d = kf(p, [0, 0.3, 1], [b.r * 0.85, b.r + 30, b.r + 70], theme.ease.out);
    const s = kf(p, [0, 0.3, 1], [0, 1.1, 0]);
    return <path key={b.i} d={SPARK} fill={b.c} opacity={op} transform={`translate(220 290) rotate(${b.a}) translate(0 ${-d}) scale(${s})`} />;
  });

  // Accesorios
  const vSt = vis("stheami"), vMu = vis("musica"), vEs = vis("estudio"), vCo = vis("contacto");
  const vCe = vis("celebra"), vHo = Math.max(vis("hola"), vCe), vAd = vis("admisiones"), vVi = vis("viaje");

  const twinkle = (k: number) => {
    const p = ((frame + k * 33) % 66) / 66;
    return { s: kf(p, [0, 0.5, 1], [0.6, 1.15, 0.6]), r: kf(p, [0, 0.5, 1], [0, 20, 0]), o: kf(p, [0, 0.5, 1], [0.5, 1, 0.5]) };
  };

  return (
    <div style={{ width: size, height: size, position: "relative", opacity: visible ? 1 : 0 }}>
      <svg viewBox="-130 -60 700 700" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <mask id={`${id}-draw`} maskUnits="userSpaceOnUse" x="-40" y="-40" width="520" height="660">
            <path d={TRACE} pathLength={1} fill="none" stroke="#fff" strokeWidth={56} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={traceOff} />
          </mask>
          <clipPath id={`${id}-win`}><path d={PLATE} /></clipPath>
          <linearGradient id={`${id}-trail`} gradientUnits="userSpaceOnUse" x1="0" y1="-270" x2="-200" y2="-180">
            <stop offset="0" stopColor={C.yellow} /><stop offset="1" stopColor={C.yellow} stopOpacity="0" />
          </linearGradient>
        </defs>

        <ellipse cx="220" cy="618" rx="150" ry="16" fill={C.navy} opacity={shadowO} transform={around(220, 618, `scale(${shadowS})`)} />

        {/* STHEAMI: siete planetas orbitan la elipse */}
        {vSt > 0.01 && (
          <g opacity={vSt} transform={`translate(220 290) scale(${(0.4 + 0.6 * vSt)}) scale(1 1.28)`}>
            <g transform={`rotate(${frame * 0.9})`}>
              <circle r="262" fill="none" stroke={C.ring} strokeOpacity={0.25} strokeWidth={3} strokeDasharray="6 14" vectorEffect="non-scaling-stroke" />
              {SEVEN.map((c, k) => (
                <circle key={k} cx={(262 * Math.cos((k / 7) * 2 * Math.PI)).toFixed(1)} cy={(262 * Math.sin((k / 7) * 2 * Math.PI)).toFixed(1)} r={14} fill={c} />
              ))}
            </g>
          </g>
        )}
        {/* Viaje: una estrella fugaz da la vuelta al mundo de Lunita */}
        {vVi > 0.01 && (
          <g opacity={vVi} transform={`translate(220 290) scale(${0.4 + 0.6 * vVi}) scale(1 1.25)`}>
            <g transform={`rotate(${kf((frame % 66) / 66, [0, 1], [0, 360], theme.ease.soft)})`}>
              <path d="M0-270A270 270 0 0 0-191-191" fill="none" stroke={`url(#${id}-trail)`} strokeWidth={10} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path d={star(0, -270, 24, 10)} fill={C.yellow} stroke={C.yellowD} strokeWidth={4} strokeLinejoin="round" />
            </g>
          </g>
        )}
        {/* Música: ondas a ambos lados al compás */}
        {vMu > 0.01 && (
          <g opacity={vMu} transform={accT(vMu, 220, 290)}>
            {[0, 1, 2].flatMap((k) => {
              const p = ((frame - k * 5 + 300) % 30) / 30;
              const o = kf(p, [0, 0.3, 1], [0, 1, 0]);
              const s = kf(p, [0, 1], [0.7, 1.15], theme.ease.out);
              const col = k === 1 ? C.sky : C.purple;
              const xr = 462 + k * 34, xl = -22 - k * 34;
              return [
                <path key={`r${k}`} d={`M${xr} ${222 - k * 22}Q${500 + k * 44} 290 ${xr} ${358 + k * 22}`} fill="none" stroke={col} strokeWidth={11} strokeLinecap="round" opacity={o} transform={around(xr + 20, 290, `scale(${s})`)} />,
                <path key={`l${k}`} d={`M${xl} ${222 - k * 22}Q${-60 - k * 44} 290 ${xl} ${358 + k * 22}`} fill="none" stroke={col} strokeWidth={11} strokeLinecap="round" opacity={o} transform={around(xl - 20, 290, `scale(${s})`)} />,
              ];
            })}
          </g>
        )}

        <g transform={around(220, 576, `rotate(${tilt + bodyRot})`)}>
          <g transform={around(220, 576, `translate(0 ${bodyTy}) scale(${bodySx} ${bodySy})`)}>
            <path d={PLATE} fill={C.white} opacity={plateO} transform={around(220, 290, `scale(${plateS})`)} />
            <g mask={`url(#${id}-draw)`}><path d={RING} fill={C.ring} /></g>

            {/* Admisiones: estrellitas de colores llegan al abrazo de la luna */}
            {vAd > 0.01 && (
              <g>
                {FAMILY.map(([x, y, c, fx, fy], k) => {
                  const w = acc.find((a) => a.pose === "admisiones")!;
                  const p = spring({ frame: frame - w.from - k * 6, fps, config: theme.spring.bouncy });
                  return <path key={k} d={star(x, y, 18, 7.5)} fill={c} opacity={Math.min(1, p * 1.5) * vAd} transform={`translate(${fx * (1 - p)} ${fy * (1 - p)}) ${around(x, y, `scale(${p}) rotate(${-200 * (1 - p)})`)}`} />;
                })}
              </g>
            )}
            {/* Aprendizaje: barras que crecen (de Jardín a Once) */}
            {vEs > 0.01 && (
              <g opacity={vEs}>
                {([[C.green, 280, 46], [C.sky, 322, 78], [C.purple, 364, 112]] as const).map(([c, x, hh], k) => {
                  const w = acc.find((a) => a.pose === "estudio")!;
                  const g = spring({ frame: frame - w.from - 4 - k * 5, fps, config: theme.spring.bouncy });
                  return <rect key={k} x={x - 15} y={430 - hh} width={30} height={hh} rx={10} fill={c} transform={around(x, 430, `scale(1 ${g})`)} />;
                })}
              </g>
            )}

            <g clipPath={pt >= 0 ? `url(#${id}-win)` : undefined}>
              <g opacity={moonO} transform={`${around(220, 290, `rotate(${moonOrbit}) scale(${moonScale})`)} ${around(184, 320, `translate(${moonTx} ${moonTy}) rotate(${moonRot})`)}`}>
                <path fill="#ffc80d" d={MOON} />
                <path fill="#ff9c02" d={SHADE} opacity={shadeO} transform={`translate(${shadeTx} ${shadeTy})`} />
              </g>
            </g>

            {/* Contacto: la estrella emite señales */}
            {vCo > 0.01 && (
              <g opacity={vCo}>
                {[0, 1, 2].map((k) => {
                  const p = ((frame + 300 - k * 24) % 72) / 72;
                  return <circle key={k} cx={299.5} cy={125.8} r={30} fill="none" stroke={C.sky} strokeWidth={5} opacity={kf(p, [0, 1], [0.9, 0], theme.ease.out)} transform={around(299.5, 125.8, `scale(${kf(p, [0, 1], [0.6, 3.4], theme.ease.out)})`)} />;
                })}
              </g>
            )}

            <g transform={around(299.5, 125.8, `translate(0 ${starTy}) rotate(${starRot}) scale(${Math.max(0, starScale)})`)}>
              <path fill="#ffc80d" d={STAR} />
              <path fill="#ff9c02" d={SSHADE} />
            </g>
          </g>
        </g>

        {/* Chispas ambientales (hola / celebra) */}
        {vHo > 0.01 && (
          <g opacity={vHo}>
            {([["M500 46l10 24 24 10-24 10-10 24-10-24-24-10 24-10z", C.yellow, 500, 80], ["M-80 130l10 24 24 10-24 10-10 24-10-24-24-10 24-10z", C.sky, -80, 164], ["M-66 470l8 18 18 8-18 8-8 18-8-18-18-8 18-8z", C.purple, -66, 496]] as const).map(([d, c, cx, cy], k) => {
              const t = twinkle(k);
              return <path key={k} d={d} fill={c} opacity={t.o} transform={around(cx, cy, `scale(${t.s * (0.4 + 0.6 * vHo)}) rotate(${t.r})`)} />;
            })}
          </g>
        )}
        {vCe > 0.01 && (
          <g opacity={vCe}>
            {[
              <rect key="a" x="-96" y="10" width="22" height="12" rx="4" fill={C.red} />,
              <rect key="b" x="400" y="-36" width="22" height="12" rx="4" fill={C.green} />,
              <circle key="c" cx="540" cy="300" r="10" fill={C.orange} />,
              <circle key="d" cx="-104" cy="350" r="10" fill={C.green} />,
              <rect key="e" x="80" y="-50" width="20" height="11" rx="4" fill={C.sky} />,
              <rect key="f" x="520" y="520" width="20" height="11" rx="4" fill={C.pink} />,
            ].map((el, k) => {
              const t = twinkle(k);
              const pos = [[-85, 16], [411, -30], [540, 300], [-104, 350], [90, -44], [530, 525]][k];
              return <g key={k} transform={around(pos[0], pos[1], `scale(${t.s}) rotate(${t.r * 3 + k * 30})`)}>{el}</g>;
            })}
          </g>
        )}
        {sparks}
      </svg>
    </div>
  );
};
