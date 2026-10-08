/**
 * Facts check. Run: node scripts/check-facts.ts  (Node >= 22.18 strips types natively)
 *
 * 1. Imports every data file, so each Zod schema parses (source + asOf required).
 * 2. Scans shipped text (src/, public/) for banned claims and banned words.
 *    A term may appear only between `// facts:allow <Term,...>` and `// facts:end`
 *    markers that name it (used for LexIntelligence, which really uses them).
 * 3. Semantic asserts the regex cannot express.
 * Exits 1 on any failure.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

import { projects } from "../src/data/projects.ts";
import { oss, ossSummary } from "../src/data/oss.ts";
import { experience } from "../src/data/experience.ts";
import { skills } from "../src/data/skills.ts";
import { profile } from "../src/data/profile.ts";
import { personal } from "../src/data/personal.ts";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const errors: string[] = [];

function readPrivateTerms(): [string, RegExp][] {
  try {
    return readFileSync(join(root, "scripts/private-terms.local.txt"), "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
      .map((l): [string, RegExp] => ["private term", new RegExp(l, "i")]);
  } catch {
    return [];
  }
}

// ── 2. Banned terms ──────────────────────────────────────────────────────
// [label, pattern]. Label is what a facts:allow marker must name.
const banned: [string, RegExp][] = [
  // Contradicted or unproven technology claims (FACTS-CHECK.md §Banned)
  ["Microservices", /micro-?services?/i],
  ["CQRS", /\bCQRS\b/i],
  ["Event Sourcing", /event[ -]sourc/i],
  ["Kubernetes", /kubernetes|\bk8s\b/i],
  ["Terraform", /terraform/i],
  ["Kafka", /kafka/i],
  ["gRPC", /\bgrpc\b/i],
  ["GraphQL", /graphql/i],
  ["TimescaleDB", /timescale/i],
  ["Node.js", /node\.?js/i],
  ["OAuth", /oauth/i],
  ["MySQL", /mysql/i],
  // Eventora
  ["11-state", /\b11[- ]state/i],
  ["194 tests", /\b194\b/],
  ["83%", /\b83(\.\d+)?\s?%/],
  ["700 VUs", /\b700\b/],
  ["live API", /live api/i],
  // Recruiter-Pro
  ["LangChain", /langchain/i],
  ["RAG", /\bRAG\b/],
  ["ChromaDB", /chroma/i],
  ["30-resume", /30[- ]resume/i],
  // The owner's public name is spelled "Abdelrhman" (docs/ISSUES.md ISS-14)
  ["name spelling", /abdelrahman/i],
  // PhishSniffer
  ["XGBoost", /xgboost/i],
  ["50+ features", /50\+?\s*features/i],
  ["10,000+", /10,?000\+/],
  // SysPlex
  ["5 s refresh", /\b5\s?-?s(ec(ond)?s?)?\b.{0,20}refresh|refresh.{0,20}\b5\s?-?s(ec(ond)?s?)?\b/i],
  ["3 agents", /\b(3|three)\s+agents/i],
  ["130+ tests", /\b130\+/],
  // Do-not-publish terms are private: one regex per line in the git-ignored
  // scripts/private-terms.local.txt (absent in CI, so run this check locally).
  ...readPrivateTerms(),
  // Unqualified adjectives and banned copy words
  ["production-grade", /production[- ]grade/i],
  ["scalable", /\bscalable\b/i],
  ["expert", /\bexpert\b/i],
  ["passionate", /passionate/i],
  ["cutting-edge", /cutting[- ]edge/i],
  ["seamless", /seamless/i],
  ["leverage", /leverag/i],
  ["robust", /\brobust/i],
  ["delve", /\bdelve/i],
  ["unlock", /\bunlock/i],
  ["elevate", /\belevat/i],
  ["innovative", /innovati/i],
  ["journey", /\bjourney/i],
  ["crafting", /\bcrafting/i],
];

const SCAN_DIRS = ["src", "public"];
const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".css", ".md", ".mdx", ".svg", ".txt", ".webmanifest"]);

function* walk(dir: string): Generator<string> {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (SCAN_EXT.has(extname(name))) yield p;
  }
}

for (const dir of SCAN_DIRS) {
  for (const file of walk(join(root, dir))) {
    const rel = relative(root, file).replaceAll("\\", "/");
    let allowed = new Set<string>();
    readFileSync(file, "utf8")
      .split(/\r?\n/)
      .forEach((line, i) => {
        const open = line.match(/facts:allow\s+([\w.,+ -]+)/);
        if (open) {
          allowed = new Set((open[1] ?? "").split(",").map((s) => s.trim()));
          return;
        }
        if (/facts:end/.test(line)) {
          allowed = new Set();
          return;
        }
        for (const [label, re] of banned) {
          if (re.test(line) && !allowed.has(label)) {
            errors.push(`${rel}:${i + 1} banned "${label}": ${line.trim().slice(0, 100)}`);
          }
        }
      });
  }
}

// ── 3. Semantic asserts ──────────────────────────────────────────────────
const pr = (repo: string, n: number) => oss.pullRequests.find((p) => p.repo === repo && p.number === n);

for (const [repo, n] of [
  ["litestar-org/litestar", 5019],
  ["eclipse-collections/eclipse-collections", 1965],
] as const) {
  const p = pr(repo, n);
  if (!p) errors.push(`oss.json: ${repo}#${n} missing`);
  else if (p.state !== "open")
    errors.push(`oss.json: ${repo}#${n} is "${p.state}" in the snapshot; verify on GitHub and update FACTS-CHECK.md first`);
}
if (pr("firstcontributions/first-contributions", 123531)) errors.push("oss.json: first-contributions PR must be excluded");

const s = ossSummary();
// magefree/mage #16440 merged on 2026-10-07 (docs/ISSUES.md ISS-16).
if (s.merged !== 8 || s.mergedProjects !== 6 || s.open !== 3) {
  errors.push(`oss summary is ${s.merged} merged / ${s.mergedProjects} projects / ${s.open} open; recorded headline is 8 / 6 / 3`);
}

const eventora = projects.find((p) => p.slug === "eventora");
const states = eventora?.metrics.find((m) => m.id === "states");
if (states?.value !== 10) errors.push("projects.ts: Eventora booking states must be 10 (BookingState.java)");
if (eventora?.links.some((l) => /railway\.app/.test(l.href))) errors.push("projects.ts: the Railway API is not live; do not link it");

for (const p of projects) {
  for (const m of p.metrics) {
    if (/local/i.test(m.label + (m.qualifier ?? "")) === false && /^local-|burst/.test(m.id)) {
      errors.push(`projects.ts: ${p.slug}/${m.id} must be labelled "local, Docker Compose"`);
    }
  }
}

for (const p of projects) {
  for (const a of p.screenshots) {
    try {
      statSync(join(root, "public", a.src));
    } catch {
      errors.push(`projects.ts: ${p.slug} screenshot ${a.src} is missing from public/`);
    }
  }
  if (p.tier !== "secondary" && p.screenshots.length === 0 && !p.flow) {
    errors.push(`projects.ts: ${p.slug} has neither screenshots nor a flow to show on its card`);
  }
}

for (const c of experience.certifications) {
  if (/\b(19|20)\d{2}\b/.test(JSON.stringify(c).replace(/"asOf":"[^"]+"/, ""))) {
    errors.push(`experience.ts: certification "${c.name}" carries a date`);
  }
}

// The H1 is the public name (docs/ISSUES.md ISS-12, ISS-14).
if (profile.hero.headline.text !== `${personal.name.value}.`) {
  errors.push(`profile.ts: hero headline "${profile.hero.headline.text}" must be personal.name plus a period`);
}

if (skills.length === 0 || !profile.hero.headline.text || !personal.github.href) {
  errors.push("data files failed to load");
}

// ── Report ───────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`facts check: ${errors.length} problem(s)\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(
  `facts check: ok (${projects.length} projects, ${oss.pullRequests.length} PRs, ${skills.length} chips; ` +
    `${s.merged} merged across ${s.mergedProjects} projects, ${s.open} under review, ${s.from} to ${s.to})`,
);
