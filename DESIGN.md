---
name: Hearth & Wave
description: Contemplative craft design system for Vanya's autonomous workspace, services, and creative tools. Deep dark charcoal ground, warm linen text, glowing amber flame, micro-radii, and hairline borders.

colors:
  # Surfaces
  ground: "oklch(0.185 0.008 65)"               # warm dark charcoal paper base
  surface: "oklch(0.235 0.010 65)"              # cards, panels, drawers
  surface-raised: "oklch(0.270 0.012 65)"       # hover and elevated states
  surface-inset: "oklch(0.150 0.006 65)"        # inputs, terminal blocks, code

  # Ink (Text)
  ink: "oklch(0.930 0.008 75)"                  # primary warm linen text
  ink-soft: "oklch(0.680 0.012 75)"             # secondary descriptions, badges
  ink-faint: "oklch(0.480 0.012 70)"            # meta, timestamps, quiet labels
  ink-disabled: "oklch(0.350 0.008 70)"         # disabled state

  # Accents (Fire)
  flame-amber: "#ffb266"                        # primary living amber focus
  flame-amber-glow: "oklch(0.68 0.155 45)"      # amber diffuse glow base
  flame-carmine: "#d92027"                      # carmine ember alert

  # Hairlines
  hairline: "oklch(1 0 0 / 12%)"                # 1px border default
  hairline-active: "oklch(1 0 0 / 24%)"         # 1px border hover/active
  hairline-amber: "rgba(255, 178, 102, 0.4)"    # active focus hairline

radii:
  xs: "2px"                                     # buttons, pills, tags, inputs
  sm: "4px"                                     # cards, modals, drawers

typography:
  serif: "Fraunces, ui-serif, Georgia, serif"   # narrative dates, identity
  sans: "Manrope, ui-sans-serif, sans-serif"    # UI labels, cards, buttons
  mono: "JetBrains Mono, monospace"             # telemetry, ports, metrics (lowercase)

rules:
  - "Color belongs on data and living focus, never on decorative chrome (<= 3-5% colored pixels)."
  - "Declare elevation once: hairline border OR surface shift, never heavy drop shadows."
  - "No kickers or eyebrows above headings. Let the heading speak."
  - "No icons in filled round circles. No gradient text."
  - "Monospace is lowercase and used strictly for data, metrics, code, and ports."
---

# Hearth & Wave Design System

This repository holds the tokens, primitives, and anti-slop rules for all personal tools built by Vanya Afanasov.
Consumers:
- `salon-presence` (Костёр)
- `life-wave-narrative` (Синусоида)
- `ferma` (Пространственный радар)
- `vanya-space` (Контрол-плейн спейса)
