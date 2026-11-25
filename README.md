# Landing Matrículas 2027 — Liceo Lunita de Chía

Landing comercial de una sola página para pauta pagada (Meta y Google Ads), con el mismo estilo claro y lúdico
del sitio institucional y la mascota **Lunita** como protagonista (SVG + CSS, sin Rive).

- **Publicada en:** https://jlpineda12.github.io/landing-matriculas-2027-liceo-lunita/ (prototipo con `noindex`)
- **Conversión:** WhatsApp con mensaje prellenado, llamada, "Ir a matrícula en SIGA" y formulario corto que abre WhatsApp (no guarda datos).
- **Video:** motion graphics de 29 s con Lunita (Remotion) y música original sintetizada (libre de derechos).

## Estructura

| Carpeta | Qué hay |
| --- | --- |
| `src/` | Landing en Astro 7 (`pages/index.astro`, datos en `data/site.ts`, estilos en `styles/`) |
| `public/video/` | Video web 16:9 (WebM + MP4 livianos, póster y subtítulos) |
| `video/` | Proyecto Remotion del video (16:9 y 9:16) y la música (`scripts/compose-music.mjs`) |
| `entregables/` | Masters en alta: `lunita-matriculas-2027-16x9.mp4` y `lunita-matriculas-2027-9x16.mp4` (pauta) |

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321
npm run build
```

## Píxeles de Meta y Google (desactivados)

Se activan solo cuando existan los IDs. En GitHub: **Settings → Secrets and variables → Actions → Variables**:

- `PUBLIC_META_PIXEL_ID` — píxel de Meta (solo números)
- `PUBLIC_GTAG_ID` — GA4 (`G-…`) o Google Ads (`AW-…`)
- `PUBLIC_GADS_CONVERSION` — conversión de Google Ads (`AW-…/etiqueta`), opcional
- `PUBLIC_NOINDEX` — `true` (por defecto) o `false` para permitir indexación

Los clics en WhatsApp/llamar/SIGA envían `Contact` (Meta) y `contact` (Google); el formulario envía `Lead` / `generate_lead`.
Los scripts se cargan tras la primera interacción para no afectar la velocidad.

## Video

```bash
cd video
npm install
node scripts/compose-music.mjs          # regenera la música y efectos (public/audio)
npx remotion studio                      # vista previa
npx remotion render src/index.ts Landscape out/lunita-matriculas-2027-16x9.mp4 --codec h264 --crf 18
npx remotion render src/index.ts Vertical  out/lunita-matriculas-2027-9x16.mp4 --codec h264 --crf 18
```

## Datos

Costos, contactos, cifras y requisitos vienen del sitio institucional. Los costos son **referencia 2026**; los de 2027
se confirman en la matrícula. Pendiente: la dirección exacta de la sede. No publique cifras ni testimonios sin confirmar.
