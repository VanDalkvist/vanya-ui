---
name: Hearth & Wave
description: Contemplative craft design system for Vanya's autonomous workspace, services, and creative tools. Supports dual-theme: Warm Paper Archive (light) and Warm Dark Charcoal (dark), with glowing amber accents, micro-radii (2-4px), and hairline borders.

colors:
  # Dark Mode (Warm Dark Charcoal)
  dark:
    ground: "oklch(0.185 0.008 65)"               # warm dark charcoal paper base #181816
    surface: "oklch(0.235 0.010 65)"              # cards, panels, drawers #22221f
    surface-raised: "oklch(0.270 0.012 65)"       # hover and elevated states
    surface-inset: "oklch(0.150 0.006 65)"        # inputs, terminal blocks, code
    ink: "oklch(0.930 0.008 75)"                  # primary warm linen text #ece4d6
    ink-soft: "oklch(0.680 0.012 75)"             # secondary descriptions, badges
    ink-faint: "oklch(0.480 0.012 70)"            # meta, timestamps, quiet labels
    amber: "#ffb266"                              # primary living amber focus
    amber-soft: "rgba(255, 178, 102, 0.15)"       # amber diffuse glow base
    hairline: "oklch(1 0 0 / 12%)"                # 1px border default
    hairline-active: "oklch(1 0 0 / 24%)"         # 1px border hover/active

  # Light Mode (Warm Paper Archive)
  light:
    ground: "oklch(0.964 0.008 85)"               # warm creamy linen paper #f6f5f0
    surface: "oklch(0.979 0.006 85)"              # clean paper card
    surface-raised: "oklch(0.992 0.004 85)"       # hover card
    surface-inset: "oklch(0.940 0.010 85)"        # inputs, wells
    ink: "oklch(0.265 0.012 60)"                  # deep charcoal ink #181816
    ink-soft: "oklch(0.560 0.014 70)"             # soft secondary ink
    ink-faint: "oklch(0.720 0.010 70)"            # quiet labels, timestamps
    amber: "oklch(0.530 0.135 42)"                # warm terracotta / amber on paper
    amber-soft: "rgba(186, 92, 32, 0.12)"         # terracotta wash
    hairline: "oklch(0 0 0 / 10%)"                # 1px dark hairline on paper
    hairline-active: "oklch(0 0 0 / 22%)"         # 1px active hairline

radii:
  xs: "2px"                                     # buttons, pills, tags, inputs
  sm: "4px"                                     # cards, modals, drawers

typography:
  serif: "Fraunces, ui-serif, Georgia, serif"   # narrative dates, identity
  sans: "Manrope, ui-sans-serif, sans-serif"    # UI labels, cards, buttons
  mono: "JetBrains Mono, monospace"             # telemetry, ports, metrics (lowercase)

rules:
  - "Color belongs on data and living focus, never on decorative chrome (<= 3-5% colored pixels)."
  - "Dual-theme is mandatory: every component must render cleanly in both Paper Light and Charcoal Dark."
  - "Declare elevation once: hairline border OR surface shift, never heavy drop shadows."
  - "No kickers or eyebrows above headings. Let the heading speak."
  - "No icons in filled round circles. No gradient text."
  - "Monospace is lowercase and used strictly for data, metrics, code, and ports."
---

# Hearth & Wave Design System

This repository holds the tokens, primitives, and anti-slop rules for all personal tools built by Vanya Afanasov.
Supports dual-mode theme switching via Tailwind v4 `@custom-variant dark`.
