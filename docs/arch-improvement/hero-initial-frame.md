# Hero initial frame — #32

Baseline b2f9e12fa6f73e0f8730fe3c72b3359462f28231. Owner observed another wave geometry briefly on page load.

Source diagnosis: prerender renders SineWave with default 1200×400 viewBox. Client layout effect measures actual CSS dimensions, then ResizeObserver updates. Header height is measured after mount; web fonts can change geometry. This makes a different provisional frame possible before client hydration. Exact live flash not independently reproduced before this change.

Decision: keep public SineWave API and geometry untouched, scope the reveal gate to the showcase hero. Prerender retains full markup and CSS reserves the same space. Scripting-enabled media hides only provisional wave; no-script browsers retain fallback. The local hook waits for document font readiness, measured viewBox agreement, measured header and two consistent frame samples before showing. No timeout animation, layout redesign, new dependency or change to consumers.

Evidence plan: compiled browser regression at 1440/390 widths delays actual JS, checks hidden fallback and positive dimensions, deliberately exposes fallback to verify oracle, samples visible frames across hydration, tests final slider geometry and no-JS fallback. Existing build and unit gates unchanged; new test NOT_RUN at commit. Browser visual acceptance and production readback pending.
