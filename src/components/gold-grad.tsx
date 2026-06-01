/**
 * Hidden SVG defs providing the shared gold gradient referenced by progress
 * rings via `stroke: url(#goldgrad)`. Rendered once per portal page tree.
 */
export default function GoldGrad() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="goldgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A07E2E" />
          <stop offset="1" stopColor="#E4C868" />
        </linearGradient>
      </defs>
    </svg>
  );
}
