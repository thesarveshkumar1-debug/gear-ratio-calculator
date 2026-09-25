/**
 * Pure helpers for the stylized gear-mesh visualization. Kept separate from the
 * engineering calculation module (gearCalculations.ts) and from React — this is
 * presentation math only (SVG geometry, animation timing), not physics.
 * Geometry is deliberately simplified (not involute tooth profiles) since the
 * goal is a legible engineering diagram, not a CAD-accurate model.
 */

const MIN_RADIUS = 30;
const MAX_RADIUS = 108;
const MIN_TEETH_BOUND = 4;
const MAX_TEETH_BOUND = 300;

const MIN_VISUAL_TEETH = 8;
const MAX_VISUAL_TEETH = 36;

/** Maps a real tooth count onto a display radius using a log scale so extreme ratios stay legible. */
export function scaleTeethToRadius(teeth: number): number {
  const clampedTeeth = Math.min(Math.max(teeth, MIN_TEETH_BOUND), MAX_TEETH_BOUND);
  const logMin = Math.log(MIN_TEETH_BOUND);
  const logMax = Math.log(MAX_TEETH_BOUND);
  const t = (Math.log(clampedTeeth) - logMin) / (logMax - logMin);
  return MIN_RADIUS + t * (MAX_RADIUS - MIN_RADIUS);
}

/** Caps the number of drawn teeth so very high tooth counts don't render as visual noise. */
export function scaleTeethForDrawing(teeth: number): number {
  return Math.round(Math.min(Math.max(teeth, MIN_VISUAL_TEETH), MAX_VISUAL_TEETH));
}

/**
 * Builds an SVG path for a simplified gear disc: a polygon alternating between
 * an outer (tip) radius and an inner (root) radius, `teethCount` times around.
 */
export function buildGearPath(
  cx: number,
  cy: number,
  teethCount: number,
  outerRadius: number,
  toothDepthRatio = 0.8
): string {
  const innerRadius = outerRadius * toothDepthRatio;
  const steps = teethCount * 2;
  const points: string[] = [];

  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return `M ${points.join(" L ")} Z`;
}

const MIN_SPIN_MS = 500;
const MAX_SPIN_MS = 7000;

/** Maps RPM to a full-rotation CSS animation duration — faster spin at higher RPM, clamped for legibility. */
export function computeSpinDurationMs(rpm: number): number {
  const safeRpm = Math.max(rpm, 1);
  const duration = 4000 * Math.sqrt(100 / safeRpm);
  return Math.min(Math.max(duration, MIN_SPIN_MS), MAX_SPIN_MS);
}
