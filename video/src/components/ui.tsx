/** Piezas visuales del video, con el lenguaje del sitio: marfil, figuras planas, órbitas y botones "sticker". */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const C = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useSpring = (delay: number, config: keyof typeof theme.spring = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[config] });
};

/** Salida de escena: más rápida que la entrada (10 cuadros). */
export const useExit = (dur: number, len = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [dur - len, dur], [0, 1], { ...clamp, easing: theme.ease.in });
};

/** Entrada premium: opacidad + subida + escala, con resorte. */
export const Rise: React.FC<{ delay?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties; rot?: number }> = ({ delay = 0, y = 46, children, style, rot = 0 }) => {
  const p = useSpring(delay, "smooth");
  return (
    <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])}) rotate(${interpolate(p, [0, 1], [rot, 0])}deg)`, ...style }}>
      {children}
    </div>
  );
};

/** Titular palabra por palabra ("\n" fuerza salto de línea). */
export const Words: React.FC<{ text: string; delay?: number; per?: number; size: number; color?: string; style?: React.CSSProperties }> = ({ text, delay = 0, per = 3, size, color = C.navy, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let n = 0;
  const justify = style?.justifyContent ?? "flex-start";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: justify === "center" ? "center" : "flex-start", fontSize: size, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.04, color, ...style }}>
      {text.split("\n").map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "nowrap", columnGap: size * 0.26, justifyContent: justify, whiteSpace: "nowrap" }}>
          {line.split(" ").map((w) => {
            const i = n++;
            const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
            return (
              <span key={i} style={{ display: "inline-block", whiteSpace: "nowrap", opacity: Math.min(1, p * 1.5), transform: `translateY(${interpolate(p, [0, 1], [size * 0.45, 0])}px) rotate(${interpolate(p, [0, 1], [6, 0])}deg)` }}>{w}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Palabra en sticker de color (como el hero del sitio). */
export const StickerWord: React.FC<{ text: string; c: string; d: string; fg?: string; size: number; delay?: number; rot?: number; style?: React.CSSProperties }> = ({ text, c, d, fg = C.navy, size, delay = 0, rot = -2, style }) => {
  const p = useSpring(delay, "bouncy");
  return (
    <span style={{ display: "inline-block", padding: `0 ${size * 0.22}px ${size * 0.04}px`, borderRadius: size * 0.24, background: c, color: fg, boxShadow: `0 ${size * 0.09}px 0 ${d}`,
      fontSize: size, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.12, whiteSpace: "nowrap",
      opacity: Math.min(1, p * 2), transform: `scale(${interpolate(p, [0, 1], [0.3, 1])}) rotate(${interpolate(p, [0, 1], [-18, rot])}deg)`, ...style }}>
      {text}
    </span>
  );
};

export const Kicker: React.FC<{ text: string; color?: string; size?: number; delay?: number }> = ({ text, color = C.blue, size = 30, delay = 0 }) => (
  <Rise delay={delay} y={20}>
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.45, fontSize: size, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color }}>
      <span style={{ width: size * 0.55, height: size * 0.55, borderRadius: "50%", boxShadow: `inset ${-size * 0.17}px ${size * 0.04}px 0 0 ${color}`, transform: "rotate(-20deg)" }} />
      {text}
    </div>
  </Rise>
);

/** Pastilla de color (niveles, destinos). */
export const Chip: React.FC<{ text: string; c: string; d: string; fg?: string; size: number; delay?: number; icon?: React.ReactNode }> = ({ text, c, d, fg = C.white, size, delay = 0, icon }) => {
  const p = useSpring(delay, "bouncy");
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4, padding: `${size * 0.32}px ${size * 0.8}px`, borderRadius: 999, background: c, color: fg, boxShadow: `0 ${size * 0.18}px 0 ${d}`,
      fontSize: size, fontWeight: 900, letterSpacing: "0.02em", whiteSpace: "nowrap", opacity: Math.min(1, p * 2), transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.5, 1])})` }}>
      {icon}
      {text}
    </div>
  );
};

/** Botón sticker (como .btn del sitio). */
export const Button: React.FC<{ children: React.ReactNode; c: string; d: string; fg: string; size: number; delay?: number; border?: string }> = ({ children, c, d, fg, size, delay = 0, border }) => {
  const p = useSpring(delay, "bouncy");
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.5, padding: `${size * 0.55}px ${size * 1.1}px`, borderRadius: 999, background: c, color: fg, border, boxShadow: `0 ${size * 0.22}px 0 ${d}`,
      fontSize: size, fontWeight: 900, letterSpacing: "0.03em", whiteSpace: "nowrap", opacity: Math.min(1, p * 2), transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.6, 1])})` }}>
      {children}
    </div>
  );
};

export const IconWhatsapp: React.FC<{ size: number; color?: string }> = ({ size, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 48 48"><path d="M24 5a19 19 0 0 0-16.4 28.6L5 43l9.7-2.5A19 19 0 1 0 24 5z" fill={color} /><path d="M17 15c-1 1-2 3-1 6 2 5 6 9 11 11 3 1 5 0 6-1l1-3-4-2-2 2c-3-1-6-4-7-7l2-2-2-4z" fill={C.green} /></svg>
);
export const IconPhone: React.FC<{ size: number; color?: string }> = ({ size, color = C.sky }) => (
  <svg width={size} height={size} viewBox="0 0 48 48"><path d="M12 5h7l3 9-4 3a24 24 0 0 0 13 13l3-4 9 3v7a4 4 0 0 1-4 4C21 40 8 27 8 9a4 4 0 0 1 4-4z" fill={color} /></svg>
);
export const IconPlane: React.FC<{ size: number; color?: string }> = ({ size, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 48 48"><path d="M44 8 4 22l13 5 3 13 7-9 9 7z" fill={color} /><path d="m17 27 21-15-14 19" fill="rgba(0,0,0,.18)" /></svg>
);
export const IconCalendar: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48"><rect x="5" y="9" width="38" height="34" rx="6" fill="#fff" stroke={C.blue} strokeWidth="3" /><path d="M5 15a6 6 0 0 1 6-6h26a6 6 0 0 1 6 6v5H5z" fill={C.blue} /><rect x="13" y="4" width="5" height="10" rx="2.5" fill={C.blueD} /><rect x="30" y="4" width="5" height="10" rx="2.5" fill={C.blueD} /><circle cx="15" cy="28" r="2.6" fill={C.blue} /><circle cx="24" cy="28" r="2.6" fill={C.blue} /><circle cx="33" cy="28" r="2.6" fill={C.blue} /><rect x="21" y="33" width="15" height="6" rx="3" fill={C.yellow} /></svg>
);

/** Foto real en tarjeta redondeada, con Ken Burns. */
export const PhotoCard: React.FC<{ src: string; w: number; h: number; delay: number; rot: number; dur: number; zoomIn?: boolean; children?: React.ReactNode }> = ({ src, w, h, delay, rot, dur, zoomIn = true, children }) => {
  const frame = useCurrentFrame();
  const p = useSpring(delay, "smooth");
  const kb = interpolate(frame, [delay, dur], zoomIn ? [1, 1.1] : [1.1, 1], { ...clamp, easing: theme.ease.inOut });
  const pan = interpolate(frame, [delay, dur], [0, -22], { ...clamp, easing: theme.ease.inOut });
  return (
    <div style={{ position: "relative", width: w, height: h, opacity: Math.min(1, p * 1.6), transform: `translateY(${interpolate(p, [0, 1], [90, 0])}px) rotate(${interpolate(p, [0, 1], [rot * 3, rot])}deg) scale(${interpolate(p, [0, 1], [0.85, 1])})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: C.white, boxShadow: `0 14px 0 rgba(15,23,71,.12)`, padding: 14 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 28, overflow: "hidden" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb}) translateX(${pan}px)` }} />
        </div>
      </div>
      {children}
    </div>
  );
};

// ---------------------------------------------------------------- Fondo --
const star = (cx: number, cy: number, R: number, r: number, n = 5) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const a = ((-90 + (i * 180) / n) * Math.PI) / 180, rr = i % 2 ? r : R;
    return `${i ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }).join("") + "Z";
const PATHS: Record<string, string> = {
  moon: "M126 18A84 84 0 1 0 184 140A68 68 0 0 1 126 18Z",
  hill: "M22 168 L84 62 Q100 36 116 62 L178 168 Z",
  star: star(100, 104, 84, 40),
  sun: star(100, 100, 88, 62, 12),
  rombo: "M100 12 L188 100 L100 188 L12 100 Z",
};
export type ShapeKind = "moon" | "planet" | "hill" | "star" | "rombo" | "sun";

export const FlatShape: React.FC<{ k: ShapeKind; c: string; d: string }> = ({ k, c, d }) => (
  <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
    {k === "planet" ? (
      <>
        <circle cx="100" cy="110" r="62" fill={d} />
        <circle cx="100" cy="100" r="62" fill={c} />
        <circle cx="78" cy="80" r="12" fill="#fff" opacity=".35" />
        <ellipse cx="100" cy="104" rx="96" ry="26" fill="none" stroke={d} strokeWidth="12" transform="rotate(-16 100 104)" />
      </>
    ) : k === "rombo" ? (
      <>
        <path d={PATHS.rombo} transform="translate(0 10)" fill={d} stroke={d} strokeWidth="16" strokeLinejoin="round" />
        <path d={PATHS.rombo} fill={c} stroke={c} strokeWidth="16" strokeLinejoin="round" />
        <path d="M100 58 L142 100 L100 142 L58 100 Z" fill="#fff" opacity=".9" />
        <path d="M100 84 L116 100 L100 116 L84 100 Z" fill={c} />
      </>
    ) : (
      <>
        <path d={PATHS[k]} transform="translate(0 10)" fill={d} stroke={d} strokeWidth="14" strokeLinejoin="round" />
        <path d={PATHS[k]} fill={c} stroke={c} strokeWidth="14" strokeLinejoin="round" />
        {k === "moon" && <circle cx="66" cy="70" r="10" fill="#fff" opacity=".35" />}
        {k === "hill" && <path d="M84 62 Q100 36 116 62 L108 76 L100 68 L92 78 Z" fill="#fff" />}
        {k === "sun" && <circle cx="100" cy="100" r="36" fill="#fff" opacity=".9" />}
      </>
    )}
  </svg>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px", backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.045, mixBlendMode: "multiply" }} />;
};
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 58%, rgba(15,23,71,0.10) 100%)" }} />
);
