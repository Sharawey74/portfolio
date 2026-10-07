/** M12: fixed decorative layers (hairline grid, vignette, grain). CSS in globals.css. */
export function Surfaces() {
  return (
    <>
      <div aria-hidden="true" className="surface-grid" />
      <div aria-hidden="true" className="surface-vignette" />
      <div aria-hidden="true" className="surface-grain" />
    </>
  );
}
