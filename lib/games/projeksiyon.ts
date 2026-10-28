/**
 * Dünya haritasının projeksiyonu (scripts/gen_dunya.py ile aynı formül):
 * Miller silindirik, boylam -169..191, enlem 83.7 üstü kesik, genişlik 1000.
 * Koordinat oyunları enlem-boylamı bu fonksiyonlarla haritaya çevirir.
 */

const W = 1000;
const LON_MIN = -169;
const LON_MAX = 191;
const LAT_MAX = 83.7;
const LAT_MIN = -57;

const rad = (d: number) => (d * Math.PI) / 180;
const miller = (lat: number) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * rad(lat)));
const SX = W / rad(LON_MAX - LON_MIN);
const Y_TOP = miller(LAT_MAX);

/** Boylam (doğu +, batı −) ve enlem (kuzey +, güney −) → harita noktası */
export function projekte(lon: number, lat: number): { x: number; y: number } {
  const l = lon < LON_MIN ? lon + 360 : lon;
  const e = Math.max(Math.min(lat, LAT_MAX), LAT_MIN);
  return { x: rad(l - LON_MIN) * SX, y: (Y_TOP - miller(e)) * SX };
}

/** Harita noktası → boylam, enlem */
export function geriProjekte(x: number, y: number): { lon: number; lat: number } {
  let lon = (x / SX) * (180 / Math.PI) + LON_MIN;
  if (lon > 180) lon -= 360;
  const m = Y_TOP - y / SX;
  const lat = ((Math.atan(Math.exp(m / 1.25)) - Math.PI / 4) / 0.4) * (180 / Math.PI);
  return { lon, lat };
}

/** 20 → "20°K", -15 → "15°G" */
export const enlemYaz = (lat: number) => (lat === 0 ? "0°" : `${Math.abs(Math.round(lat))}°${lat > 0 ? "K" : "G"}`);
/** 45 → "45°D", -60 → "60°B" */
export const boylamYaz = (lon: number) => (lon === 0 || Math.abs(lon) === 180 ? `${Math.abs(lon)}°` : `${Math.abs(Math.round(lon))}°${lon > 0 ? "D" : "B"}`);
