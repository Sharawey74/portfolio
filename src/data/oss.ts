import { z } from "zod";
import snapshot from "./oss.json" with { type: "json" };

/**
 * Open-source contributions to repos the owner does not own.
 * `oss.json` is the committed snapshot and the fallback. In Stage 4 the page
 * refreshes `state` from the public GitHub API with ISR (revalidate 86400);
 * if that fails, this snapshot renders.
 *
 * Excluded on purpose: firstcontributions#123531 (onboarding PR) and the
 * comment-only Micrometer threads (#7625, #7886). See FACTS-CHECK.md.
 * Status is shown by shape, not color: merged = filled pill + check glyph,
 * open = outline pill + ring glyph + break dot, always with text.
 */

const isoDate = z.iso.date();

const pullRequest = z.object({
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
  number: z.number().int().positive(),
  title: z.string().min(1),
  state: z.enum(["merged", "open"]),
  createdAt: isoDate,
  mergedAt: isoDate.nullable(),
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative(),
  fixes: z.number().int().positive().nullable(),
  note: z.string().optional(),
});

const issue = z.object({
  repo: z.string(),
  number: z.number().int().positive(),
  title: z.string().min(1),
  state: z.enum(["open", "closed"]),
  createdAt: isoDate,
  /** What the owner may claim about it. Never claim the upstream fix. */
  note: z.string().min(1),
});

const snapshotSchema = z
  .object({
    fetchedAt: isoDate,
    source: z.string(),
    pullRequests: z.array(pullRequest),
    issues: z.array(issue),
  })
  .refine((s) => s.pullRequests.every((p) => (p.state === "merged") === (p.mergedAt !== null)), {
    message: "mergedAt must be set exactly when state is merged",
  });

export type PullRequest = z.infer<typeof pullRequest>;

export const oss = snapshotSchema.parse(snapshot);

export const prUrl = (p: Pick<PullRequest, "repo" | "number">) =>
  `https://github.com/${p.repo}/pull/${p.number}`;
export const issueUrl = (repo: string, n: number) => `https://github.com/${repo}/issues/${n}`;

/** Headline numbers derive from the list, so they cannot drift from it. */
export function ossSummary(prs: readonly PullRequest[] = oss.pullRequests) {
  const merged = prs.filter((p) => p.state === "merged");
  const open = prs.filter((p) => p.state === "open");
  const dates = prs.map((p) => p.createdAt).sort();
  return {
    merged: merged.length,
    mergedProjects: new Set(merged.map((p) => p.repo)).size,
    open: open.length,
    from: dates[0]?.slice(0, 7),
    to: dates.at(-1)?.slice(0, 7),
    source: "evidence-report.md:309-364",
    asOf: oss.fetchedAt,
  };
}
