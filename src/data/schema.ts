import { z } from "zod";

/**
 * Shared schemas for every data file. Each data file calls `.parse()` at
 * import time, so a claim without `source` or `asOf` fails `next build`.
 *
 * Rules (see FACTS-CHECK.md):
 * - `source` is `repo/path:line`, `repo/path`, `evidence-report.md:line`, or an https URL.
 * - `asOf` is the ISO date the fact was measured or last verified.
 * - Missing facts are `TODO(owner): ...` strings in `todos`; they render nothing.
 */

export const todo = z.string().regex(/^TODO\(owner\): \S.*/, "must start with 'TODO(owner): '");

export const source = z.string().min(3);
export const asOf = z.iso.date();

export const evidence = z.object({ source, asOf });

/** One sentence of public copy that states a fact. */
export const claim = evidence.extend({
  text: z.string().min(1),
});

/** A number shown publicly. `display` is the exact rendered string. */
export const metric = evidence.extend({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  value: z.number(),
  display: z.string().min(1),
  unit: z.string().optional(),
  /** Qualifier that must render next to the number, e.g. "local, Docker Compose". */
  qualifier: z.string().optional(),
});

/**
 * A public link. `status` is the HTTP status of a read-only probe on `asOf`.
 * Only 200 is accepted, plus 303 for Streamlit's wake redirect.
 */
export const link = evidence.extend({
  label: z.string().min(1),
  href: z.url({ protocol: /^https$/ }),
  kind: z.enum(["repo", "live", "site", "registry", "pr", "issue", "release"]),
  status: z.union([z.literal(200), z.literal(303)]),
  /** Short microcopy shown beside the link. */
  note: z.string().optional(),
});

/** One versioned stack entry backed by a manifest file. */
export const stackItem = evidence.extend({
  name: z.string().min(1),
  version: z.string().optional(),
});

/** A file copied (read-only) from a source repo into /public. */
export const asset = z.object({
  /** Provenance: path inside the source repo. */
  from: z.string().min(1),
  /** Served path under /public. */
  src: z.string().startsWith("/"),
  /** Intrinsic size, so the image reserves its box (no layout shift). */
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(1),
});

export type Claim = z.infer<typeof claim>;
export type Metric = z.infer<typeof metric>;
export type Link = z.infer<typeof link>;
export type StackItem = z.infer<typeof stackItem>;
export type Asset = z.infer<typeof asset>;
