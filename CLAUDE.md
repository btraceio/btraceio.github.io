# btraceio.github.io

Static org landing page. See README.md for layout. No build; verify by serving
the root (`python3 -m http.server`) and checking desktop + 390px width with no
horizontal scroll.

## BTrace design language

Use this for all BTrace / btraceio work unless told otherwise.

- Base: Modernist design system tokens (`assets/modernist.css`), inverted to a dark ground. Page bg `var(--color-text)`, text `var(--color-bg)`, deep panels `color-mix(in oklch,var(--color-text),black 45%)`.
- Accent: `var(--color-accent)` red used as neon (glow via text-/box-shadow); small red text uses `--color-accent-400` on dark.
- Texture: fixed CRT scanlines + slow scan sweep, 64px faint grid on main, HUD corner brackets on key panels, red scrolling ticker at top.
- Type: Oxanium 700 uppercase for display/headings; JetBrains Mono for labels, buttons, code, terminals; Archivo for body copy.
- Structure: zero radius, 2px rules (`--color-neutral-800/700`), flush-left everything, section kickers like `// 02 // Start here`, `[01]` numbering.
- Motion: expressive scroll reveals, glitch on hero headline; respect prefers-reduced-motion.
- Icon: "Frames and probe" — files in `icon/` (use `btrace-icon-small.svg` at ≤48px).
- Copy: ASD-STE100 Simplified Technical English — short sentences, one topic each, active voice, no -ing nouns/adjectives, no phrasal verbs or contractions, consistent terms (live JVM, attach, detach, remove the probe).
