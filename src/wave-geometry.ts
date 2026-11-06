/** Wave-only geometry adapted from life-wave-narrative f11918ec, temporal.ts. */
export type EventWeight = 1 | 2 | 3 | 4;
export interface PointAppearance {
  weight?: EventWeight;
  focus?: number;
  count?: number;
  current?: boolean;
  future?: boolean;
  highlighted?: boolean;
}
export type WavePosition = { x: number; y: number };
export const WAVE_SLOPE = -0.03;
const BASE_RADII = { 1: 3, 2: 4.5, 3: 6.5, 4: 9 };
const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const smooth = (low: number, high: number, value: number) => {
  const t = clamp((value - low) / (high - low));
  return t * t * (3 - 2 * t);
};

export function pointRadius({ weight = 2, focus = 1, count = 1, highlighted = false }: PointAppearance) {
  return (BASE_RADII[weight] ?? 4.5) * (0.8 + clamp(focus) * 0.32)
    * (count > 1 ? 1 + Math.min(count, 12) * 0.035 : 1) * (highlighted ? 1.35 : 1);
}

export function branchIdentity(id: string) {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return { direction: (hash & 1) === 0 ? 1 : -1, seed: ((hash >>> 0) % 1000) / 1000 };
}

export function createWaveGeometry(width: number, height: number, { zoom = 8.602, origin = 0 } = {}) {
  if (![width, height, zoom].every(value => Number.isFinite(value) && value > 0) || !Number.isFinite(origin)) {
    throw new RangeError("Wave dimensions and zoom must be positive and finite; origin must be finite");
  }
  const pxPerYear = 140 * zoom;
  const amplitude = Math.min(height * 0.2, 165);
  const worldAt = (position: number) => origin + (position - 0.5) * width;
  const pointAtWorld = (worldX: number): WavePosition => {
    let y = WAVE_SLOPE * worldX;
    for (let k = 0; k < 16; k++) {
      const wavelength = 44 / 2 ** k * pxPerYear;
      const fade = smooth(90, 320, wavelength) * (1 - smooth(2400, 6200, wavelength));
      const a = Math.min(amplitude, wavelength * 0.17) * fade;
      if (a > 0.2) y += a * Math.sin(worldX / wavelength * Math.PI * 2);
    }
    return { x: worldX - origin + width / 2, y: height * 0.52 + y - WAVE_SLOPE * origin };
  };
  const pointAt = (position: number) => pointAtWorld(worldAt(position));
  const branchAt = (position: number, dx: number, direction: number, seed: number): WavePosition => {
    const base = pointAtWorld(worldAt(position) + dx);
    const u = Math.max(0, dx / pxPerYear);
    const open = 1 - Math.exp(-u / 4);
    const s1 = Math.sin((u * (0.3 + 1.2 * seed) + seed * 5.1) * Math.PI * 2);
    const s2 = Math.sin((u * (0.15 + 0.6 * (1 - seed)) + (1 - seed) * 3.7) * Math.PI * 2);
    const separation = amplitude * ((2 + 6 * seed) * open + 0.5 * u * (0.2 + 0.5 * seed))
      + amplitude * ((0.5 + 1.3 * seed) * s1 + 0.4 * s2) * open;
    return { x: base.x, y: base.y + direction * separation };
  };
  const path = (from = 0, to = 1) => {
    if (to <= from) return "";
    const points = [];
    for (let x = from * width; x < to * width; x += 7) points.push(pointAt(x / width));
    points.push(pointAt(to));
    return points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  };
  const branchDots = (position: number, id: string) => {
    const { direction, seed } = branchIdentity(id);
    const end = Math.min(width * (1 - position), pxPerYear * 26);
    const points = [];
    for (let dx = 0; dx < end; dx += 16) points.push(branchAt(position, dx, direction, seed));
    if (end > 0) points.push(branchAt(position, end, direction, seed));
    return points;
  };
  return { pointAt, branchAt, branchDots, path };
}
