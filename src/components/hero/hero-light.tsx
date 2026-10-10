/**
 * Hero light (Stage 7, docs/ISSUES.md ISS-42): a pulsing core, slow rays and
 * two drifting rings in the accent, drawn with CSS gradients and borders only.
 * No script and no request, so it costs nothing before the first paint (the
 * LCP work in ISS-36). Decorative: aria-hidden. Loops stop with the global
 * pause and are static under reduced motion (see .hero-light in globals.css).
 * Hidden below 1024 px, where the text needs the width.
 */
export function HeroLight() {
  return (
    <div aria-hidden="true" className="hero-light">
      <span className="hero-light-glow" />
      <span className="hero-light-rays" />
      <span className="hero-light-ring" />
      <span className="hero-light-ring hero-light-ring-inner" />
      <span className="hero-light-core" />
    </div>
  );
}
