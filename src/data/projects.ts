import { z } from "zod";
import { asset, claim, link, metric, stackItem, todo } from "./schema.ts";

/**
 * Projects. Sources are `<repo>/<path>:<line>` relative to the owner's Desktop,
 * `evidence-report.md:<line>`, or a GitHub URL. Every entry is logged in
 * FACTS-CHECK.md. Banned claims are listed there and enforced by
 * scripts/check-facts.ts.
 */

const VERIFIED = "2026-10-06";

/**
 * An animated diagram (M9) is a claim: every node and every step cites the
 * source file it was drawn from, and steps may only connect declared nodes.
 */
const flowNode = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  detail: z.string().min(1),
  source: z.string().min(3),
});
const flowStep = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().min(1),
  source: z.string().min(3),
  /**
   * Which path a step belongs to: "both" (shared), "main" or "alt" (e.g. sold
   * out). A path is the steps of that branch plus "both", in source order.
   */
  branch: z.enum(["both", "main", "alt"]).default("both"),
});
const flow = z
  .object({
    caption: z.string().min(1),
    source: z.string().min(3),
    asOf: z.iso.date(),
    mainLabel: z.string().optional(),
    altLabel: z.string().optional(),
    nodes: z.array(flowNode).min(2),
    steps: z.array(flowStep).min(1),
  })
  .refine((f) => f.steps.every((s) => f.nodes.some((n) => n.id === s.from) && f.nodes.some((n) => n.id === s.to)), {
    message: "every step must connect two declared nodes",
  });

/** Evidence charts (M9d): committed numbers only, each chart sourced. */
/** Operating points: one marker per measured configuration, shared axes. */
const pointChart = z.object({
  kind: z.literal("points"),
  id: z.string(),
  caption: z.string(),
  qualifier: z.string(),
  xLabel: z.string(),
  yLabel: z.string(),
  source: z.string().min(3),
  asOf: z.iso.date(),
  points: z
    .array(
      z.object({
        label: z.string(),
        x: z.number(),
        y: z.number(),
        display: z.string(),
        note: z.string(),
        highlight: z.boolean().default(false),
      }),
    )
    .min(2),
  footnote: z.string(),
});
const stepChart = z.object({
  kind: z.literal("steps"),
  id: z.string(),
  caption: z.string(),
  qualifier: z.string(),
  xLabel: z.string(),
  yLabel: z.string(),
  source: z.string().min(3),
  asOf: z.iso.date(),
  points: z.array(z.tuple([z.number(), z.number()])).min(2),
  outcomes: z.array(z.object({ label: z.string(), display: z.string(), highlight: z.boolean().default(false) })),
  footnote: z.string(),
});
const chart = z.discriminatedUnion("kind", [pointChart, stepChart]);

const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    tier: z.enum(["flagship", "case-study", "secondary"]),
    summary: claim,
    /** Case-study pages only. */
    problem: claim.optional(),
    facts: z.array(claim),
    decisions: z.array(claim),
    metrics: z.array(metric),
    stack: z.array(stackItem),
    links: z.array(link),
    /** Limits shown publicly, as written. */
    caveats: z.array(claim),
    flow: flow.optional(),
    charts: z.array(chart).default([]),
    /** Metric ids shown on the home-page card, in order. */
    highlights: z.array(z.string()).max(3).default([]),
    screenshots: z.array(asset),
    todos: z.array(todo),
  })
  .refine((p) => p.tier === "secondary" || (p.problem !== undefined && p.flow !== undefined), {
    message: "case-study projects need a problem statement and a flow",
  })
  .refine((p) => p.highlights.every((id) => p.metrics.some((m) => m.id === id)), {
    message: "highlights must reference this project's metric ids",
  })
  .refine(
    (p) =>
      p.charts.every(
        (c) =>
          (c.kind === "points" ? c.points : c.outcomes).filter((x) => x.highlight).length <= 1,
      ),
    { message: "at most one highlighted (break-colored) value per chart" },
  );

export const projects = z.array(projectSchema).parse([
  // ── Eventora ──────────────────────────────────────────────────────────
  {
    slug: "eventora",
    highlights: ["tests", "coverage", "ramp-requests"],
    name: "Eventora",
    tier: "flagship",
    summary: {
      text: "Event ticketing platform: one Spring Boot deployable (modular monolith) and a Next.js frontend.",
      source: "Event-Ticketing-Platform/README.md:7; pom.xml:11-12",
      asOf: VERIFIED,
    },
    problem: {
      text: "Many buyers reach for the same seats at the same moment. The booking path has to refuse oversell, absorb retried payments, and keep Redis and PostgreSQL in agreement.",
      source: "Event-Ticketing-Platform/README.md:7,159-164",
      asOf: VERIFIED,
    },
    facts: [
      {
        text: "Booking lifecycle governed by a 10-state Spring State Machine.",
        source: "Event-Ticketing-Platform/src/main/java/com/ticketing/booking/model/BookingState.java",
        asOf: VERIFIED,
      },
      {
        text: "CI on GitHub Actions: 3 jobs (backend verify with JaCoCo, frontend Vitest and build, repo hygiene), green on 2026-09-07.",
        source: "Event-Ticketing-Platform/.github/workflows/main.yml:13-70; gh run list",
        asOf: "2026-09-07",
      },
    ],
    decisions: [
      {
        text: "A Redis Lua script checks availability and decrements in one atomic step. A test fires 100 concurrent threads at a 50-seat tier: exactly 50 succeed.",
        source: "Event-Ticketing-Platform/README.md:159",
        asOf: VERIFIED,
      },
      {
        text: "PostgreSQL inventory is written with one conditional UPDATE ... WHERE available_count >= :qty instead of read-modify-write.",
        source: "Event-Ticketing-Platform/README.md:160",
        asOf: VERIFIED,
      },
      {
        text: "Optimistic locking with @Version on Booking, TicketTier and Event; a lost update returns 409, not 500.",
        source: "Event-Ticketing-Platform/README.md:162",
        asOf: VERIFIED,
      },
      {
        text: "Stripe webhooks are deduplicated by a database UNIQUE constraint; booking creation requires an Idempotency-Key header.",
        source: "Event-Ticketing-Platform/README.md:164,395",
        asOf: VERIFIED,
      },
      {
        text: "QR codes and emails go through RabbitMQ with dead-letter queues, off the request thread.",
        source: "Event-Ticketing-Platform/README.md:52,170",
        asOf: VERIFIED,
      },
      {
        text: "JWT with a jti claim and a Redis denylist revokes tokens on logout; @PreAuthorize role checks gate 18 of 30 endpoints.",
        source: "Event-Ticketing-Platform/README.md:392,396",
        asOf: VERIFIED,
      },
    ],
    metrics: [
      { id: "commits", label: "Commits", value: 415, display: "415", qualifier: "2026-03-21 to 2026-09-07", source: "evidence-report.md:29", asOf: VERIFIED },
      { id: "tests", label: "Automated tests", value: 228, display: "228", qualifier: "228 / 228 passing", source: "Event-Ticketing-Platform/README.md:253", asOf: "2026-09-07" },
      { id: "coverage", label: "JaCoCo instruction coverage", value: 84.1, display: "84.1", unit: "%", qualifier: "gated packages, gate 80%", source: "Event-Ticketing-Platform/README.md:254", asOf: "2026-09-07" },
      { id: "states", label: "Booking states", value: 10, display: "10", source: "Event-Ticketing-Platform/src/main/java/com/ticketing/booking/model/BookingState.java", asOf: VERIFIED },
      { id: "controllers", label: "Controllers", value: 9, display: "9", source: "Event-Ticketing-Platform/README.md:55,240", asOf: VERIFIED },
      { id: "endpoints", label: "Endpoints", value: 30, display: "30+", qualifier: "31 mapping annotations in code", source: "Event-Ticketing-Platform/README.md:55; evidence-report.md:122", asOf: VERIFIED },
      { id: "migrations", label: "Flyway migrations", value: 14, display: "14", source: "Event-Ticketing-Platform/src/main/resources/db/migration", asOf: VERIFIED },
      { id: "ramp-vus", label: "Peak virtual users", value: 200, display: "200", unit: "VUs", qualifier: "Railway, ramp 10 to 200 VUs over 16 min, read path", source: "Event-Ticketing-Platform/PERFORMANCE.md:263-298", asOf: "2026-07-04" },
      { id: "ramp-requests", label: "Requests", value: 32577, display: "32,577", qualifier: "Railway ramp, read path", source: "Event-Ticketing-Platform/PERFORMANCE.md:283", asOf: "2026-07-04" },
      { id: "ramp-failed", label: "Failed requests", value: 0, display: "0.00", unit: "%", qualifier: "Railway ramp, read path", source: "Event-Ticketing-Platform/PERFORMANCE.md:285", asOf: "2026-07-04" },
      { id: "ramp-p95", label: "p95 latency", value: 394, display: "394", unit: "ms", qualifier: "Railway ramp, about 394 ms", source: "Event-Ticketing-Platform/PERFORMANCE.md:288-291", asOf: "2026-07-04" },
      { id: "local-1-rps", label: "Read ceiling, 1 replica", value: 660, display: "660", unit: "req/s", qualifier: "local, Docker Compose; p95 511 ms", source: "Event-Ticketing-Platform/PERFORMANCE.md:382,411", asOf: VERIFIED },
      { id: "local-1-p95", label: "p95 at ceiling, 1 replica", value: 511, display: "511", unit: "ms", qualifier: "local, Docker Compose", source: "Event-Ticketing-Platform/PERFORMANCE.md:382,386", asOf: VERIFIED },
      { id: "local-2-rps", label: "Sustained rate, 2 replicas behind nginx", value: 800, display: "800", unit: "req/s", qualifier: "local, Docker Compose; p95 9.0 ms", source: "Event-Ticketing-Platform/PERFORMANCE.md:400", asOf: VERIFIED },
      { id: "local-2-p95", label: "p95 at 800 req/s, 2 replicas", value: 9.0, display: "9.0", unit: "ms", qualifier: "local, Docker Compose", source: "Event-Ticketing-Platform/PERFORMANCE.md:400,416", asOf: VERIFIED },
      { id: "burst-oversell", label: "Oversold seats, 100-VU inventory burst", value: 0, display: "0", qualifier: "local, Docker Compose", source: "Event-Ticketing-Platform/PERFORMANCE.md:321", asOf: VERIFIED },
    ],
    stack: [
      { name: "Java", version: "21", source: "Event-Ticketing-Platform/pom.xml:17", asOf: VERIFIED },
      { name: "Spring Boot", version: "3.5.13", source: "Event-Ticketing-Platform/pom.xml:8", asOf: VERIFIED },
      { name: "Spring State Machine", version: "4.0.0", source: "Event-Ticketing-Platform/pom.xml:78-80", asOf: VERIFIED },
      { name: "PostgreSQL", version: "17", source: "Event-Ticketing-Platform/docker-compose.yml:12", asOf: VERIFIED },
      { name: "Redis", version: "7", source: "Event-Ticketing-Platform/docker-compose.yml:29", asOf: VERIFIED },
      { name: "RabbitMQ", version: "4", source: "Event-Ticketing-Platform/docker-compose.yml:41", asOf: VERIFIED },
      { name: "Flyway", source: "Event-Ticketing-Platform/pom.xml:58", asOf: VERIFIED },
      { name: "Stripe", source: "Event-Ticketing-Platform/pom.xml:89", asOf: VERIFIED },
      { name: "Testcontainers", source: "Event-Ticketing-Platform/pom.xml:139-170", asOf: VERIFIED },
      { name: "k6", source: "Event-Ticketing-Platform/src/test/k6", asOf: VERIFIED },
      { name: "Nginx", version: "1.27", source: "Event-Ticketing-Platform/docker-compose.scale.yml:75", asOf: VERIFIED },
      { name: "Next.js", version: "16.2.4", source: "Event-Ticketing-Platform/frontend/package.json:19", asOf: VERIFIED },
      { name: "React", version: "19.2.4", source: "Event-Ticketing-Platform/frontend/package.json:20", asOf: VERIFIED },
      { name: "Tailwind CSS", version: "4", source: "Event-Ticketing-Platform/frontend/package.json:33", asOf: VERIFIED },
      { name: "Vitest", version: "3.2.4", source: "Event-Ticketing-Platform/frontend/package.json:35", asOf: VERIFIED },
    ],
    links: [
      { label: "Source", href: "https://github.com/Sharawey74/Event-Ticketing-Platform", kind: "repo", status: 200, source: "curl probe", asOf: VERIFIED },
      { label: "Frontend", href: "https://event-ticketing-platform-nu.vercel.app", kind: "live", status: 200, note: "Frontend only", source: "curl probe", asOf: VERIFIED },
      { label: "Project site", href: "https://sharawey74.github.io/Event-Ticketing-Platform/", kind: "site", status: 200, source: "curl probe", asOf: VERIFIED },
    ],
    caveats: [
      {
        text: "The hosted API answered 404 on every probed path on 2026-10-06, so only the frontend is linked as live.",
        source: "evidence-report.md:113",
        asOf: VERIFIED,
      },
      {
        text: "The Railway ramp exercised the read path only (browse and search); no run above 200 VUs is recorded.",
        source: "Event-Ticketing-Platform/PERFORMANCE.md:265-275",
        asOf: "2026-07-04",
      },
    ],
    flow: {
      caption: "Reservation flow, concurrency-critical path",
      source: "Event-Ticketing-Platform/README.md:118-148",
      asOf: VERIFIED,
      mainLabel: "Seats available",
      altLabel: "Sold out",
      nodes: [
        { id: "client", label: "Client", detail: "POST /api/v1/bookings", source: "Event-Ticketing-Platform/README.md:124" },
        { id: "api", label: "BookingService", detail: "Spring Boot API", source: "Event-Ticketing-Platform/README.md:124; Event-Ticketing-Platform/pom.xml:8" },
        { id: "redis", label: "Redis", detail: "lock, availability, Lua floor guard", source: "Event-Ticketing-Platform/README.md:126-128" },
        { id: "postgres", label: "PostgreSQL", detail: "conditional UPDATE, booking row", source: "Event-Ticketing-Platform/README.md:133-136" },
      ],
      steps: [
        { from: "client", to: "api", label: "POST /api/v1/bookings", source: "Event-Ticketing-Platform/README.md:124" },
        { from: "api", to: "redis", label: "acquire per-user distributed lock", source: "Event-Ticketing-Platform/README.md:126" },
        { from: "api", to: "redis", label: "re-check availability (TOCTOU guard)", source: "Event-Ticketing-Platform/README.md:127" },
        { from: "api", to: "redis", label: "reserveSeat(): atomic Lua floor guard", source: "Event-Ticketing-Platform/README.md:128" },
        { from: "redis", to: "api", label: "decremented, success", source: "Event-Ticketing-Platform/README.md:132", branch: "main" },
        { from: "api", to: "postgres", label: "atomic conditional UPDATE (availableCount -= n)", source: "Event-Ticketing-Platform/README.md:133-134", branch: "main" },
        { from: "api", to: "postgres", label: "INSERT Booking (state=RESERVED, expires=+5m)", source: "Event-Ticketing-Platform/README.md:135-136", branch: "main" },
        { from: "api", to: "client", label: "201 Created", source: "Event-Ticketing-Platform/README.md:137", branch: "main" },
        { from: "redis", to: "api", label: "rejected (floor guard)", source: "Event-Ticketing-Platform/README.md:143", branch: "alt" },
        { from: "api", to: "client", label: "409 Conflict", source: "Event-Ticketing-Platform/README.md:144", branch: "alt" },
        { from: "api", to: "redis", label: "release lock", source: "Event-Ticketing-Platform/README.md:148" },
      ],
    },
    charts: [
      {
        kind: "points",
        id: "replicas",
        caption: "Read path: one replica vs two behind nginx",
        qualifier: "local, Docker Compose",
        xLabel: "throughput, req/s",
        yLabel: "p95 latency, ms",
        source: "Event-Ticketing-Platform/PERFORMANCE.md:382,386,400-401,411-412,416",
        asOf: VERIFIED,
        points: [
          { label: "1 replica", x: 660, y: 511, display: "660 req/s · p95 511 ms", note: "its ceiling: p95 crossed 500 ms here" },
          {
            label: "2 replicas, nginx",
            x: 800,
            y: 9,
            display: "800 req/s · p95 9.0 ms",
            note: "held every stage without abort",
            highlight: true,
          },
        ],
        footnote:
          "One replica's point is its ceiling; two replicas' point is a rate they held, not their ceiling (870 req/s, p95 568 ms).",
      },
      {
        kind: "steps",
        id: "ramp",
        caption: "Capacity ramp on Railway, 2026-07-04",
        qualifier: "read path (browse and search)",
        xLabel: "minutes",
        yLabel: "target virtual users",
        source: "Event-Ticketing-Platform/src/test/k6/capacity-ramp.js@d103b56:16-23; PERFORMANCE.md:271,283-291",
        asOf: "2026-07-04",
        points: [[0, 0], [2, 10], [5, 25], [8, 50], [11, 100], [14, 200], [16, 0]],
        outcomes: [
          { label: "requests", display: "32,577" },
          { label: "failed", display: "0.00%" },
          { label: "p95", display: "394 ms", highlight: true },
        ],
        footnote: "The line is the k6 stage schedule (configured targets), not measured VUs. Results are whole-run aggregates.",
      },
    ],
    screenshots: [
      { from: "Event-Ticketing-Platform/site/assets/img/screenshots/01-landing-hero-dark.webp", src: "/projects/eventora/01-landing-hero-dark.webp", width: 1440, height: 900, alt: "Eventora home page with event search, dark theme" },
      { from: "Event-Ticketing-Platform/site/assets/img/screenshots/04-ticket-selection-cart-dark.webp", src: "/projects/eventora/04-ticket-selection-cart-dark.webp", width: 1440, height: 900, alt: "Event page with ticket tier selection" },
      { from: "Event-Ticketing-Platform/site/assets/img/screenshots/12-featured-events-dark.webp", src: "/projects/eventora/12-featured-events-dark.webp", width: 1440, height: 900, alt: "Featured events grid" },
      { from: "Event-Ticketing-Platform/site/assets/img/screenshots/05-stripe-checkout.webp", src: "/projects/eventora/05-stripe-checkout.webp", width: 1440, height: 908, alt: "Stripe-hosted checkout step" },
      { from: "Event-Ticketing-Platform/site/assets/img/screenshots/03-event-detail-dark.webp", src: "/projects/eventora/03-event-detail-dark.webp", width: 1440, height: 1458, alt: "Event detail page" },
      { from: "Event-Ticketing-Platform/site/assets/img/screenshots/08-booking-detail-qr-ticket-dark.webp", src: "/projects/eventora/08-booking-detail-qr-ticket-dark.webp", width: 1440, height: 1367, alt: "Booking detail with QR ticket" },
      { from: "Event-Ticketing-Platform/site/assets/img/screenshots/09-organizer-dashboard-dark.webp", src: "/projects/eventora/09-organizer-dashboard-dark.webp", width: 1440, height: 2618, alt: "Organizer dashboard" },
      { from: "Event-Ticketing-Platform/site/assets/img/screenshots/10-organizer-attendees-checkin-dark.webp", src: "/projects/eventora/10-organizer-attendees-checkin-dark.webp", width: 1440, height: 1226, alt: "Organizer attendee check-in list" },
      { from: "Event-Ticketing-Platform/site/assets/img/screenshots/13-refund-request.webp", src: "/projects/eventora/13-refund-request.webp", width: 1440, height: 900, alt: "Refund request form" },
    ],
    todos: ["TODO(owner): confirm whether the Railway API is intentionally down (report §7 q3)"],
  },

  // ── Recruiter-Pro ─────────────────────────────────────────────────────
  {
    slug: "recruiter-pro",
    highlights: ["corpus", "branch-coverage", "tests"],
    name: "Recruiter-Pro",
    tier: "case-study",
    summary: {
      text: "CV screening against a job corpus: parse, extract, score, explain.",
      source: "Recruiter-Pro/README.md:5",
      asOf: VERIFIED,
    },
    problem: {
      text: "A CV has to be scored against every role in an 800-job corpus, and each score has to come with a reason a recruiter can check, even when no language model is reachable.",
      source: "Recruiter-Pro/README.md:24-25,183-193",
      asOf: VERIFIED,
    },
    facts: [
      {
        text: "4-agent pipeline (parser, extractor, scorer, explainer) in one deployable; the agents are function calls, not services.",
        source: "Recruiter-Pro/README.md:131-139,198-207",
        asOf: VERIFIED,
      },
      {
        text: "FastAPI backend and a Next.js 16 frontend.",
        source: "Recruiter-Pro/requirements.txt:32; frontend/package.json:15",
        asOf: VERIFIED,
      },
      {
        text: "Explainer providers: Ollama over HTTP, OpenRouter, and a rule-based fallback.",
        source: "Recruiter-Pro/README.md:183-187; src/agents/explaining/__init__.py:30",
        asOf: VERIFIED,
      },
      {
        text: "CI runs ruff, black, mypy, pytest with a coverage floor, corpus validation and a secrets check.",
        source: "Recruiter-Pro/.github/workflows/ci.yml:43-102",
        asOf: VERIFIED,
      },
    ],
    decisions: [
      { text: "ADR-1: LLM allocation across the four-agent pipeline.", source: "Recruiter-Pro/docs/adr/001-llm-allocation.md:1", asOf: VERIFIED },
      { text: "ADR-2: an LLMProvider protocol for the explainer, so CI runs the rule-based provider with no network or key.", source: "Recruiter-Pro/docs/adr/002-llm-provider-abstraction.md:1; .github/workflows/ci.yml:69-72", asOf: VERIFIED },
      { text: "ADR-3: one unified skill vocabulary, so React, ReactJS and React.js resolve to one skill.", source: "Recruiter-Pro/docs/adr/003-unified-skill-vocabulary.md:1; README.md:136", asOf: VERIFIED },
      { text: "Every match records which provider wrote its explanation, and the UI prints it.", source: "Recruiter-Pro/README.md:189-193,245", asOf: VERIFIED },
    ],
    metrics: [
      { id: "corpus", label: "Jobs in corpus", value: 800, display: "800", source: "Recruiter-Pro/data/json/jobs.json; README.md:36", asOf: VERIFIED },
      { id: "skills", label: "Canonical skills", value: 679, display: "679", source: "Recruiter-Pro/README.md:49", asOf: VERIFIED },
      { id: "latency", label: "End to end, real PDF", value: 4.5, display: "~4.5", unit: "s", qualifier: "README figure, 161 KB PDF", source: "Recruiter-Pro/README.md:25,62", asOf: "2026-08-18" },
      { id: "branch-coverage", label: "Branch coverage", value: 84.07, display: "84.07", unit: "%", qualifier: "CI floor 81%", source: "Recruiter-Pro/README.md:37; .github/workflows/ci.yml:86", asOf: "2026-08-18" },
      { id: "tests", label: "Tests", value: 500, display: "500+", qualifier: "README states 544 and 530 in different places", source: "Recruiter-Pro/README.md:36,433", asOf: "2026-08-18" },
      { id: "adrs", label: "Architecture decision records", value: 3, display: "3", source: "Recruiter-Pro/docs/adr", asOf: VERIFIED },
    ],
    stack: [
      { name: "Python", source: "Recruiter-Pro/requirements.txt", asOf: VERIFIED },
      { name: "FastAPI", version: "0.111.0", source: "Recruiter-Pro/requirements.txt:32", asOf: VERIFIED },
      { name: "scikit-learn", source: "Recruiter-Pro/requirements.txt:51", asOf: VERIFIED },
      { name: "Ollama (HTTP)", source: "Recruiter-Pro/src/agents/explaining/__init__.py:30", asOf: VERIFIED },
      { name: "pytest", source: "Recruiter-Pro/.github/workflows/ci.yml:86", asOf: VERIFIED },
      { name: "Next.js", version: "16.3.0", source: "Recruiter-Pro/frontend/package.json:15", asOf: VERIFIED },
      { name: "React", version: "18.3.1", source: "Recruiter-Pro/frontend/package.json:16", asOf: VERIFIED },
      { name: "TypeScript", version: "5.4.2", source: "Recruiter-Pro/frontend/package.json:30", asOf: VERIFIED },
      { name: "GitHub Actions", source: "Recruiter-Pro/.github/workflows/ci.yml", asOf: VERIFIED },
    ],
    links: [
      { label: "Source", href: "https://github.com/Sharawey74/Recruiter-Pro", kind: "repo", status: 200, source: "curl probe", asOf: VERIFIED },
      { label: "Project site", href: "https://sharawey74.github.io/Recruiter-Pro/", kind: "site", status: 200, source: "curl probe", asOf: VERIFIED },
      { label: "Live app", href: "https://recruiter-pro-nine.vercel.app", kind: "live", status: 200, note: "LLM explainer runs locally", source: "curl probe; README.md:187", asOf: VERIFIED },
    ],
    caveats: [
      {
        text: "A hosted deploy without an OpenRouter key serves rule-based explanations; Ollama runs locally only.",
        source: "Recruiter-Pro/README.md:185-189",
        asOf: VERIFIED,
      },
    ],
    flow: {
      caption: "Request path through the four-agent pipeline",
      source: "Recruiter-Pro/README.md:209-240",
      asOf: VERIFIED,
      nodes: [
        { id: "client", label: "Client", detail: "Next.js 16, :3000", source: "Recruiter-Pro/README.md:211" },
        { id: "api", label: "API", detail: "FastAPI; 10 MB cap, 5/min per IP", source: "Recruiter-Pro/README.md:219-221" },
        { id: "parse", label: "1 Parser", detail: "pdf, docx, txt", source: "Recruiter-Pro/README.md:229-231" },
        { id: "extract", label: "2 Extract", detail: "679 canonical skills", source: "Recruiter-Pro/README.md:229-231,239" },
        { id: "score", label: "3 Scorer", detail: "5 weighted rules + ML; 800 roles", source: "Recruiter-Pro/README.md:229-231,239" },
        { id: "explain", label: "4 Explain", detail: "top-K only; ollama, openrouter, rule_based", source: "Recruiter-Pro/README.md:229-231,239-240" },
      ],
      steps: [
        { from: "client", to: "api", label: "REST / JSON", source: "Recruiter-Pro/README.md:216" },
        { from: "api", to: "parse", label: "dispatch", source: "Recruiter-Pro/README.md:223" },
        { from: "parse", to: "extract", label: "clean text layer", source: "Recruiter-Pro/README.md:134,229" },
        { from: "extract", to: "score", label: "structured profile", source: "Recruiter-Pro/README.md:135,229" },
        { from: "score", to: "explain", label: "top-K matches", source: "Recruiter-Pro/README.md:229,231" },
      ],
    },
    screenshots: [],
    todos: [
      "TODO(owner): real app screenshots (frontend/Images/*.png are design mockups with placeholder data, not the shipped app)",
    ],
  },

  // ── SysPlex ───────────────────────────────────────────────────────────
  {
    slug: "sysplex",
    highlights: ["refresh", "pulls", "pytest"],
    name: "SysPlex",
    tier: "case-study",
    summary: {
      text: "Cross-platform system observability: a Go native agent, a Bash agent with a FastAPI API, a PowerShell collector for Windows, and a Flask dashboard that polls every 2 s.",
      source: "SysPlex/README.md:5,43,133-165; server/static/js/dashboard.js:14",
      asOf: VERIFIED,
    },
    problem: {
      text: "CPU and GPU temperatures, fan speeds and SMART health sit behind the host's own tooling, which a containerized collector cannot reach.",
      source: "SysPlex/README.md:58",
      asOf: VERIFIED,
    },
    facts: [
      {
        text: "Agents run natively on the host; the dashboard runs in an unprivileged Docker container and reads what the agents publish.",
        source: "SysPlex/README.md:58",
        asOf: VERIFIED,
      },
      {
        text: "Dashboard image published on Docker Hub as sharawey74/system-monitor.",
        source: "SysPlex/README.md:13; Docker Hub API",
        asOf: VERIFIED,
      },
    ],
    decisions: [
      { text: "Two interchangeable agents: Go for a single static binary with no runtime, Bash for the widest sensor coverage through native tools.", source: "SysPlex/README.md:33-60", asOf: VERIFIED },
      { text: "Alert thresholds per metric, overridable by environment variable; CPU warns at 80% and goes critical at 90%.", source: "SysPlex/README.md:271-278", asOf: VERIFIED },
    ],
    metrics: [
      { id: "refresh", label: "Dashboard refresh", value: 2, display: "2", unit: "s", source: "SysPlex/server/static/js/dashboard.js:14", asOf: VERIFIED },
      { id: "cpu-warn", label: "CPU warning", value: 80, display: "80", unit: "%", source: "SysPlex/README.md:273", asOf: VERIFIED },
      { id: "cpu-critical", label: "CPU critical", value: 90, display: "90", unit: "%", source: "SysPlex/README.md:273", asOf: VERIFIED },
      { id: "pulls", label: "Docker Hub pulls", value: 124, display: "124", source: "hub.docker.com/v2/repositories/sharawey74/system-monitor/", asOf: VERIFIED },
      { id: "commits", label: "Commits", value: 37, display: "37", qualifier: "2025-12-03 to 2026-09-04", source: "evidence-report.md:31", asOf: VERIFIED },
      { id: "pytest", label: "pytest tests", value: 104, display: "104", source: "evidence-report.md:143", asOf: VERIFIED },
      { id: "go-tests", label: "Go tests", value: 3, display: "3", source: "evidence-report.md:143", asOf: VERIFIED },
    ],
    stack: [
      { name: "Go", version: "1.21", source: "SysPlex/agents/go/go.mod:3", asOf: VERIFIED },
      { name: "gopsutil", version: "3.23.11", source: "SysPlex/agents/go/go.mod:5", asOf: VERIFIED },
      { name: "Python", version: "3.11", source: "SysPlex/README.md:10", asOf: VERIFIED },
      { name: "FastAPI", source: "SysPlex/agents/bash/api/requirements.txt:4", asOf: VERIFIED },
      { name: "Flask", version: "3", source: "SysPlex/requirements.txt:21", asOf: VERIFIED },
      { name: "Bash", source: "SysPlex/agents/bash", asOf: VERIFIED },
      { name: "PowerShell", source: "SysPlex/agents/powershell", asOf: VERIFIED },
      { name: "Docker", source: "SysPlex/Dockerfile:1", asOf: VERIFIED },
      { name: "pytest", source: "SysPlex/requirements.txt", asOf: VERIFIED },
    ],
    links: [
      { label: "Source", href: "https://github.com/Sharawey74/SysPlex", kind: "repo", status: 200, source: "curl probe", asOf: VERIFIED },
      { label: "Docker Hub", href: "https://hub.docker.com/r/sharawey74/system-monitor", kind: "registry", status: 200, source: "curl probe", asOf: VERIFIED },
    ],
    caveats: [
      { text: "No CI workflow is set up yet.", source: "evidence-report.md:142", asOf: VERIFIED },
      { text: "The repository has no license file.", source: "evidence-report.md:145", asOf: VERIFIED },
      { text: "The repository has no screenshots.", source: "evidence-report.md:146", asOf: VERIFIED },
    ],
    flow: {
      caption: "Collection on the host, presentation in Docker",
      source: "SysPlex/README.md:66-106",
      asOf: VERIFIED,
      nodes: [
        { id: "go", label: "Go agent", detail: "gopsutil; HTTP :8889", source: "SysPlex/README.md:73,80" },
        { id: "bash", label: "Bash agent", detail: "native tools; FastAPI :8888", source: "SysPlex/README.md:73,79" },
        { id: "ps", label: "PowerShell", detail: "WMI, LibreHardwareMonitor", source: "SysPlex/README.md:73-77" },
        { id: "server", label: "Flask server", detail: "Docker, :5000, no privileges", source: "SysPlex/README.md:90-94" },
        { id: "dashboard", label: "Dashboard", detail: "polls every 2 s", source: "SysPlex/README.md:104; SysPlex/server/static/js/dashboard.js:14" },
      ],
      steps: [
        { from: "go", to: "server", label: "JSON envelope over HTTP", source: "SysPlex/README.md:86,259" },
        { from: "bash", to: "server", label: "JSON envelope over HTTP", source: "SysPlex/README.md:86,258" },
        { from: "ps", to: "server", label: "JSON envelope as a file", source: "SysPlex/README.md:86,185" },
        { from: "server", to: "dashboard", label: "REST, polled every 2 s", source: "SysPlex/README.md:94,104; SysPlex/server/static/js/dashboard.js:14" },
      ],
    },
    screenshots: [],
    todos: ["TODO(owner): screenshot of the SysPlex dashboard"],
  },

  // facts:allow RAG,LangChain,ChromaDB
  // ── LexIntelligence (secondary) ───────────────────────────────────────
  {
    slug: "lexintelligence",
    name: "LexIntelligence",
    tier: "secondary",
    summary: {
      text: "Dual-model RAG assistant for legal documents.",
      source: "Legal-Ai-Assistant/README.md:1-2 (HEAD)",
      asOf: VERIFIED,
    },
    facts: [
      {
        text: "FastAPI backend with ChromaDB and LangChain embedding and chat clients (committed code at HEAD).",
        source: "Legal-Ai-Assistant@HEAD backend/app/ai/vector_store.py:11, embedder.py:11, llm_client.py:17,35; requirements.txt",
        asOf: VERIFIED,
      },
    ],
    decisions: [],
    metrics: [
      { id: "scenarios", label: "Scenarios completed", value: 10, display: "10/10", qualifier: "self-run evaluation", source: "Legal-Ai-Assistant/evaluation.md:16", asOf: "2026-05-10" },
      { id: "faithfulness", label: "Faithfulness", value: 0.956, display: "0.956", qualifier: "self-run, small manual sample of 10 scenarios", source: "Legal-Ai-Assistant/evaluation.md:19", asOf: "2026-05-10" },
      { id: "commits", label: "Commits", value: 26, display: "26", qualifier: "2026-05-09 to 2026-05-10", source: "evidence-report.md:33", asOf: VERIFIED },
    ],
    stack: [
      { name: "FastAPI", version: "0.111.0", source: "Legal-Ai-Assistant/requirements.txt", asOf: VERIFIED },
      { name: "ChromaDB", source: "Legal-Ai-Assistant@HEAD backend/app/ai/vector_store.py:11", asOf: VERIFIED },
      { name: "LangChain", source: "Legal-Ai-Assistant@HEAD backend/app/ai/embedder.py:11", asOf: VERIFIED },
    ],
    links: [
      { label: "Source", href: "https://github.com/Sharawey74/LexIntelligence", kind: "repo", status: 200, source: "curl probe", asOf: VERIFIED },
    ],
    caveats: [{ text: "No automated tests.", source: "evidence-report.md:209", asOf: VERIFIED }],
    screenshots: [],
    todos: [],
  },
  // facts:end

  // ── PhishSniffer (secondary) ──────────────────────────────────────────
  {
    slug: "phishsniffer",
    name: "PhishSniffer",
    tier: "secondary",
    summary: {
      text: "Phishing-email classifier with a Streamlit UI, built as a Telecom Egypt internship deliverable.",
      source: "github.com/Sharawey74/PhishSniffer README.md:5; owner:approved-claims",
      asOf: VERIFIED,
    },
    facts: [
      {
        text: "scikit-learn models: Random Forest, Gradient Boosting, Logistic Regression, on TF-IDF plus handcrafted features.",
        source: "github.com/Sharawey74/PhishSniffer model/training.py:12-13; model/features.py:38",
        asOf: VERIFIED,
      },
      {
        text: "Trained on about 43K emails from public corpora (34,284 train, 8,571 held out).",
        source: "github.com/Sharawey74/PhishSniffer trained_models/random_forest_20250817_035020_metadata.json; data/",
        asOf: VERIFIED,
      },
    ],
    decisions: [],
    metrics: [
      { id: "accuracy", label: "Test accuracy", value: 97.7, display: "97.7", unit: "%", qualifier: "8,571 held-out samples, committed model metadata", source: "github.com/Sharawey74/PhishSniffer trained_models/random_forest_20250817_035020_metadata.json", asOf: "2025-08-17" },
    ],
    stack: [
      { name: "scikit-learn", source: "github.com/Sharawey74/PhishSniffer requirements.txt", asOf: VERIFIED },
      { name: "Streamlit", source: "github.com/Sharawey74/PhishSniffer requirements.txt", asOf: VERIFIED },
      { name: "Python", source: "github.com/Sharawey74/PhishSniffer requirements.txt", asOf: VERIFIED },
    ],
    links: [
      { label: "Source", href: "https://github.com/Sharawey74/PhishSniffer", kind: "repo", status: 200, source: "curl probe", asOf: VERIFIED },
      { label: "Live demo", href: "https://phishsniffer.streamlit.app", kind: "live", status: 303, note: "May take a few seconds to wake.", source: "curl probe; owner confirms it is up", asOf: VERIFIED },
    ],
    caveats: [],
    screenshots: [],
    todos: [],
  },
]);

export type Project = (typeof projects)[number];

export const caseStudies = projects.filter((p) => p.tier !== "secondary");
export const secondaryProjects = projects.filter((p) => p.tier === "secondary");
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
