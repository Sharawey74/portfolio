import { createNodes, edgesOf } from "./node-field.ts";

const W = 1600;
const H = 900;
const nodes = createNodes(56, W, H);
const edges = edgesOf(nodes);

/**
 * M4 static equivalent: the same seeded graph as an SVG, rendered on the
 * server. Shown with JS off, under reduced motion, with Save-Data, and until
 * the canvas has loaded. Decorative, so aria-hidden.
 */
export function HeroGraphStatic({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <g stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {edges.map(([a, b, s]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a]!.x.toFixed(1)}
            y1={nodes[a]!.y.toFixed(1)}
            x2={nodes[b]!.x.toFixed(1)}
            y2={nodes[b]!.y.toFixed(1)}
            strokeOpacity={(0.25 + s * 0.75).toFixed(2)}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      <g fill="var(--deco)">
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x.toFixed(1)} cy={n.y.toFixed(1)} r="2" />
        ))}
      </g>
    </svg>
  );
}
