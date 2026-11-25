// Tema único del video (colores, curvas, resortes, tiempos). Nunca escribir colores o curvas sueltos en componentes.
import { Easing } from "remotion";

export const theme = {
  colors: {
    ivory: "#fbf6ec", // fondo del hero del sitio
    navy: "#0f1747", // titulares
    ink: "#3c3c3c",
    ink2: "#4b4b4b",
    muted: "#5d5d6b",
    yellow: "#ffc800", // color héroe (Lunita)
    yellowD: "#e5a400",
    yellowL: "#fff4c2",
    sky: "#1cb0f6",
    skyD: "#1899d6",
    skyL: "#ddf4ff",
    blue: "#303296",
    blueD: "#22246f",
    ring: "#3047d9",
    green: "#58cc02",
    greenD: "#46a302",
    greenL: "#e5f8d4",
    orange: "#ff9600",
    orangeD: "#e08600",
    purple: "#ce82ff",
    purpleD: "#a568cc",
    red: "#ff4b4b",
    redD: "#ea2b2b",
    pink: "#ff86d0",
    pinkD: "#e266b3",
    white: "#ffffff",
    line: "#e5e5e5",
  },
  font: "Nunito",
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.65, 0, 0.35, 1),
    back: Easing.bezier(0.34, 1.56, 0.64, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    glide: { damping: 18, stiffness: 70, mass: 1 },
  },
} as const;

/** 120 BPM a 30 fps: 1 tiempo = 15 cuadros, 1 compás = 60 cuadros. */
export const BEAT = 15;
export const BAR = 60;

/** Escenas (cada una dura 2 compases; el cierre, 2,5). */
export const SCENES = {
  hook: { from: 0, dur: 120 },
  promise: { from: 120, dur: 120 },
  stheami: { from: 240, dur: 120 },
  benefits: { from: 360, dur: 120 },
  travel: { from: 480, dur: 120 },
  dates: { from: 600, dur: 120 },
  cta: { from: 720, dur: 150 },
} as const;
export const TOTAL = 870;

export const STHEAMI = [
  { k: "S", name: "Ciencia", c: theme.colors.sky, d: theme.colors.skyD },
  { k: "T", name: "Tecnología", c: theme.colors.purple, d: theme.colors.purpleD },
  { k: "H", name: "Humanidades", c: theme.colors.orange, d: theme.colors.orangeD },
  { k: "E", name: "Ingeniería", c: theme.colors.green, d: theme.colors.greenD },
  { k: "A", name: "Artes", c: theme.colors.pink, d: theme.colors.pinkD },
  { k: "M", name: "Matemáticas", c: theme.colors.yellow, d: theme.colors.yellowD },
  { k: "I", name: "Inclusión", c: theme.colors.red, d: theme.colors.redD },
] as const;

/** Datos reales (src/data/site.ts del sitio principal). */
export const DATA = {
  whatsapp: "313 432 0295",
  phone: "(601) 884 9592",
  destinations: ["Canadá", "Europa", "Londres", "China", "Cuba"],
  stats: [
    { value: 180, suffix: "+", label: "bachilleres graduados" },
    { value: 12, suffix: "", label: "promociones" },
    { value: 4, suffix: ".°", label: "puesto municipal" },
  ],
};
