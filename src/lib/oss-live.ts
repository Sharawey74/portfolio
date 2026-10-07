import { oss, type PullRequest } from "@/data/oss.ts";

const DAY = 86_400;

type ApiPull = { state: "open" | "closed"; merged_at: string | null };

/**
 * Refreshes each PR's state from the public GitHub API, cached by Next for a
 * day (ISR: the page regenerates at most once per `revalidate`). Titles,
 * line counts and notes stay as committed in oss.json. Any failure (rate
 * limit, network, timeout) keeps that PR's snapshot values.
 *
 * A PR closed without merging is dropped: it is neither merged nor under
 * review, and the snapshot schema has no other state to show.
 */
export async function getPullRequests(): Promise<{ prs: PullRequest[]; live: boolean }> {
  const headers: HeadersInit = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const results = await Promise.all(
    oss.pullRequests.map(async (p): Promise<{ pr: PullRequest | null; live: boolean }> => {
      try {
        const res = await fetch(`https://api.github.com/repos/${p.repo}/pulls/${p.number}`, {
          headers,
          next: { revalidate: DAY },
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return { pr: p, live: false };
        const api = (await res.json()) as ApiPull;
        if (api.merged_at) return { pr: { ...p, state: "merged", mergedAt: api.merged_at.slice(0, 10) }, live: true };
        if (api.state === "open") return { pr: { ...p, state: "open", mergedAt: null }, live: true };
        return { pr: null, live: true };
      } catch {
        return { pr: p, live: false };
      }
    }),
  );

  return {
    prs: results.flatMap((r) => (r.pr ? [r.pr] : [])),
    live: results.every((r) => r.live),
  };
}
