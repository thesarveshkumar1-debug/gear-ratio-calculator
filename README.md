# Gear Ratio & Speed Calculator

An interactive mechanical power transmission analysis tool for a two-gear (driver → driven) external spur gear mesh — built as a Mechanical Engineering student project that combines core mechanical engineering fundamentals with a modern web application.

Given the tooth counts, input speed, input torque and mechanical efficiency of a gear pair, the tool computes gear ratio, output speed, output torque, power flow, power loss, transmission type and rotation direction, with a live gear visualization and a dynamically-updating engineering explanation.

## Overview

Two meshing gears — a **driver** (the input, driven by a motor or shaft) and a **driven** gear (the output) — exchange rotational speed and torque according to their tooth counts. This tool models that relationship for a single external spur gear pair, distinguishing clearly between the **ideal (lossless)** transmission and the **efficiency-adjusted (actual)** transmission, and visualizes the result as an animated, interactive diagram.

## Features

- Live calculation of gear ratio, output speed, output torque and power — updates instantly as inputs change, no page reload
- Clear separation of **ideal** vs **efficiency-adjusted** torque and power
- Transmission classification (speed reduction / speed increase / 1:1) with speed-change and torque-change percentages
- Interactive SVG gear visualization with proportional gear sizes, tooth counts, RPM labels and animated opposite-direction rotation (respects `prefers-reduced-motion`)
- Dynamic, plain-English engineering analysis paragraph that updates with the inputs
- Full engineering summary card (ratio, speeds, torques, powers, efficiency, rotation)
- Unit switching for torque (N·m / lb-ft) and power (W / kW / hp), computed internally in SI units
- Inline input validation (no browser `alert()`s) covering empty fields, non-positive teeth/RPM, negative torque, and out-of-range efficiency
- "Load Example" (cycles reduction / increase / unity presets) and "Reset" controls
- Fully responsive, accessible layout (semantic HTML, labeled inputs, visible focus states, `aria-live` error messages)
- Engineering assumptions and a "How Gear Ratio Works" educational section

## Engineering Concepts

- Gear ratio and the driver/driven relationship
- Rotational speed (RPM) and how it's set by tooth count, not gear diameter alone
- Torque transmission and the tradeoff between speed and torque
- Mechanical power (P = 2πNT / 60) and power conservation across an ideal mesh
- Mechanical efficiency and where power is lost in a real gear pair
- Direction of rotation for external spur gear meshes

## Equations

For a driver gear with `Z₁` teeth and a driven gear with `Z₂` teeth:

```
Gear ratio:          i = Z₂ / Z₁
Output speed:        N₂ = N₁ × (Z₁ / Z₂)
Ideal output torque: T₂_ideal = T₁ × (Z₂ / Z₁)
Rotational power:    P = 2πNT / 60          (N in RPM, T in N·m, P in W)
Output power:        P_out = P_in × η
```

**Torque under efficiency (`η`)** — for a rigid gear pair, output speed `N₂` is fixed purely by tooth count and does not change with efficiency (gears don't slip the way a belt can). Combining that fixed kinematic speed with `P_out = P_in × η` gives:

```
T₂_actual = P_out / ω₂ = T₂_ideal × η
```

So `T₂_actual = T₁ × (Z₂ / Z₁) × η` is not an arbitrary shortcut — it's the unique torque value consistent with both the kinematic speed ratio and power conservation under one lumped efficiency. This is verified directly in the test suite (`src/lib/gearCalculations.test.ts`), which cross-checks that `T₂_actual × ω₂ == P_in × η` for every worked example.

## How It Works

1. Enter the driver gear's teeth, input RPM and input torque, and the driven gear's teeth and the system's mechanical efficiency.
2. Inputs are validated and parsed (`src/lib/validation.ts`).
3. The calculation engine (`src/lib/gearCalculations.ts`) computes gear ratio, output speed, ideal and actual torque, input/output power, power loss, transmission type and speed/torque change.
4. Results, the gear visualization, the engineering analysis paragraph and the summary card all re-render from the same computed result — everything stays consistent.

## Technology Stack

- [Next.js](https://nextjs.org/) (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS v4
- [Vitest](https://vitest.dev/) + Testing Library for unit tests
- [lucide-react](https://lucide.dev/) for icons

## Project Structure

```
src/
  app/
    layout.tsx              Root layout, metadata (SEO)
    page.tsx                Entry point — renders GearCalculatorApp
    globals.css              Design tokens (light/dark), gear-spin keyframes
  components/
    GearCalculatorApp.tsx   Top-level state: inputs, validation, computed results
    Header.tsx
    InputPanel.tsx          Driver / driven gear input cards
    NumberField.tsx         Reusable labeled number input with inline errors
    ResultsHeadline.tsx     Headline stat tiles + unit switches
    TransmissionBadges.tsx  Transmission type / speed change / torque change / rotation
    GearVisualization.tsx   Animated SVG gear mesh
    EngineeringAnalysis.tsx Dynamic explanation paragraph
    EngineeringSummary.tsx  Full results table
    AssumptionsSection.tsx
    EducationalSection.tsx  "How Gear Ratio Works"
  lib/
    gearCalculations.ts     Pure engineering calculation functions
    gearCalculations.test.ts
    validation.ts           Input parsing/validation
    units.ts                Torque/power unit conversion, number formatting
    gearVisual.ts           SVG geometry + spin-animation timing helpers
  types/
    gear.ts                 Shared domain types
```

Engineering logic is kept in `src/lib/` as small, pure, independently-testable functions — no calculation lives inside a React component.

## Installation

```bash
git clone <your-repo-url>
cd gear-ratio-calculator
npm install
```

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm run test        # run once
npm run test:watch  # watch mode
```

24 unit tests cover the calculation engine and validation logic, including the worked example (20→60 teeth, 1500 RPM, 10 N·m, 95% efficiency), speed increase/reduction/unity cases, zero-torque and 100%-efficiency edge cases, invalid tooth counts and efficiency out of range, and a large-ratio case checked for `NaN`/`Infinity`.

Other checks:

```bash
npm run lint    # ESLint
npx tsc --noEmit  # TypeScript
npm run build   # production build
```

## Engineering Assumptions

- Two external spur gears are assumed, meshing on parallel shafts.
- Gears are assumed to mesh correctly with no backlash or interference.
- Tooth count alone determines the ideal (kinematic) speed ratio.
- Shaft and bearing losses are not modeled individually.
- Efficiency is represented as a single overall transmission efficiency, not a breakdown by loss source.
- Gear deformation, backlash, lubrication losses, bearing losses and thermal effects are not modeled.
- This tool is intended for educational and preliminary engineering analysis, not final machine design certification.

## Limitations

- Models a single external spur gear pair only — no gear trains, internal gears, or non-parallel-shaft gearing (bevel, worm, etc.).
- The gear visualization is a stylized engineering diagram, not an involute-profile or CAD-accurate model.
- Does not account for backlash, thermal effects, lubrication, or dynamic/vibration loading.

## Future Improvements

- Multi-stage gear trains
- Planetary gear calculations
- Spur/helical gear comparison
- Gear module, pitch diameter and center distance calculation
- More detailed efficiency models (per-loss-source breakdown)
- Belt-and-pulley and chain-drive ratio calculators
- Exportable PDF engineering report
- CAD-oriented gear geometry visualization

## Screenshots

_Add screenshots of the desktop and mobile layouts here before publishing._

## Author

Built by a Mechanical Engineering student as a portfolio project combining mechanical power-transmission fundamentals with modern web development.
