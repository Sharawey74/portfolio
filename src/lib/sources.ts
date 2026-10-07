/**
 * Turns a data `source` ("Repo/path:lines", "Repo@HEAD path:lines",
 * "github.com/Sharawey74/Repo path:lines", "Repo/path@sha:lines") into a
 * GitHub permalink pinned to the commit the evidence was read from, so the
 * link keeps pointing at the cited lines after new pushes.
 *
 * Pinned commits were checked to exist on GitHub on 2026-10-07. Sources that
 * are not public (evidence-report.md, owner statements, probes) return null and
 * render as plain text.
 */
const REPOS: Record<string, { repo: string; sha: string }> = {
  "Event-Ticketing-Platform": { repo: "Event-Ticketing-Platform", sha: "ef96703b4e3ae86e7e29f3c62f3ed620403d1e81" },
  "Recruiter-Pro": { repo: "Recruiter-Pro", sha: "daf160bbe97e269846a78e53b5c6f5d2affeb0bf" },
  SysPlex: { repo: "SysPlex", sha: "9f3cce9e1e0446036e4683d7ca69dfa3509e8873" },
  "Legal-Ai-Assistant": { repo: "LexIntelligence", sha: "6dbd97adc8726ddba35a43399171afdf2d57036f" },
  "github.com/Sharawey74/PhishSniffer": { repo: "PhishSniffer", sha: "e62bd85d9b5331e7fcc6a5baa3c7eb580c3b11cb" },
};

export function sourceHref(source: string): string | null {
  const first = source
    .split(";")[0]!
    .replace(/\s*\(HEAD\)$/, "")
    .trim();
  if (/^hub\.docker\.com\//.test(first)) return `https://${first}`;
  // "Repo@HEAD path:lines" and "github.com/Sharawey74/Repo path:lines"
  let m = first.match(/^(github\.com\/Sharawey74\/[\w-]+|[\w-]+)(?:@HEAD)?\s+([^\s:]+)(?::([\d,-]+))?/);
  // "Repo/path[@sha]:lines"
  if (!m || !REPOS[m[1]!]) m = first.match(/^([\w-]+)\/([^\s:]+?)(?::([\d,-]+))?$/);
  if (!m) return null;
  const pinned = REPOS[m[1]!];
  if (!pinned) return null;
  let path = m[2]!;
  let sha = pinned.sha;
  const at = path.match(/^(.*)@([0-9a-f]{7,40})$/);
  if (at) {
    path = at[1]!;
    sha = at[2]!;
  }
  if (!/\.\w+$/.test(path)) return `https://github.com/Sharawey74/${pinned.repo}/tree/${sha}/${path}`;
  const lines = m[3]?.split(",")[0];
  const anchor = lines ? `#L${lines.replace("-", "-L")}` : "";
  return `https://github.com/Sharawey74/${pinned.repo}/blob/${sha}/${path}${anchor}`;
}
