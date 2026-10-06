import { z } from "zod";
import { source, asOf } from "./schema.ts";
import { projects } from "./projects.ts";

/**
 * Tech chips. A chip exists only if the evidence report's technology table
 * shows it in a repo, or it is on the owner's allowed list. Each chip names
 * where it was used. There is no "learning" lane.
 */

const lane = z.enum(["backend", "data", "delivery", "ai", "frontend"]);

const chip = z.object({
  name: z.string().min(1),
  lane,
  /** Project slugs from projects.ts, or a non-repo label such as "PlantVillage notebook". */
  usedIn: z.array(z.string()).min(1),
  /** Rendered beside the chip, e.g. "notebook". */
  qualifier: z.string().optional(),
  source,
  asOf,
});

const V = "2026-10-06";
const TT = "evidence-report.md:246-285 (technology table)";

export const skills = z
  .array(chip)
  .parse([
    // Backend
    { name: "Java 21", lane: "backend", usedIn: ["eventora"], source: "Event-Ticketing-Platform/pom.xml:17", asOf: V },
    { name: "Spring Boot 3.5", lane: "backend", usedIn: ["eventora"], source: "Event-Ticketing-Platform/pom.xml:8", asOf: V },
    { name: "Spring Security (JWT/RBAC)", lane: "backend", usedIn: ["eventora"], source: "evidence-report.md:116; Event-Ticketing-Platform/README.md:392,396", asOf: V },
    { name: "Spring Data JPA", lane: "backend", usedIn: ["eventora"], source: "evidence-report.md:116", asOf: V },
    { name: "Spring State Machine", lane: "backend", usedIn: ["eventora"], source: "Event-Ticketing-Platform/pom.xml:78-80", asOf: V },
    { name: "Flyway", lane: "backend", usedIn: ["eventora"], source: "Event-Ticketing-Platform/pom.xml:58", asOf: V },
    { name: "Python", lane: "backend", usedIn: ["recruiter-pro", "sysplex", "lexintelligence", "phishsniffer"], source: TT, asOf: V },
    { name: "FastAPI", lane: "backend", usedIn: ["recruiter-pro", "sysplex", "lexintelligence"], source: TT, asOf: V },
    { name: "Flask", lane: "backend", usedIn: ["sysplex"], source: "SysPlex/requirements.txt:21", asOf: V },
    { name: "Go", lane: "backend", usedIn: ["sysplex"], source: "SysPlex/agents/go/go.mod:3", asOf: V },
    // Data and messaging
    { name: "PostgreSQL", lane: "data", usedIn: ["eventora"], source: TT, asOf: V },
    { name: "Redis", lane: "data", usedIn: ["eventora"], source: TT, asOf: V },
    { name: "RabbitMQ", lane: "data", usedIn: ["eventora"], source: TT, asOf: V },
    // Delivery
    { name: "Docker", lane: "delivery", usedIn: ["eventora", "sysplex"], source: "evidence-report.md:114,137", asOf: V },
    { name: "Docker Compose", lane: "delivery", usedIn: ["eventora"], source: "evidence-report.md:114,118", asOf: V },
    { name: "Nginx", lane: "delivery", usedIn: ["eventora"], source: TT, asOf: V },
    { name: "GitHub Actions", lane: "delivery", usedIn: ["eventora", "recruiter-pro"], source: "evidence-report.md:119,166", asOf: V },
    { name: "k6", lane: "delivery", usedIn: ["eventora"], source: TT, asOf: V },
    { name: "Testcontainers", lane: "delivery", usedIn: ["eventora"], source: TT, asOf: V },
    { name: "JaCoCo", lane: "delivery", usedIn: ["eventora"], source: TT, asOf: V },
    { name: "pytest", lane: "delivery", usedIn: ["recruiter-pro", "sysplex"], source: "evidence-report.md:137,166", asOf: V },
    // AI and data
    { name: "scikit-learn", lane: "ai", usedIn: ["recruiter-pro", "phishsniffer"], source: "evidence-report.md:157,179", asOf: V },
    { name: "Ollama (HTTP)", lane: "ai", usedIn: ["recruiter-pro"], source: "evidence-report.md:159", asOf: V },
    // facts:allow LangChain,ChromaDB
    { name: "ChromaDB + LangChain", lane: "ai", usedIn: ["lexintelligence"], source: "evidence-report.md:207", asOf: V },
    // facts:end
    { name: "PyTorch", lane: "ai", usedIn: ["PlantVillage notebook"], qualifier: "notebook", source: "evidence-report.md:284", asOf: V },
    { name: "Streamlit", lane: "ai", usedIn: ["phishsniffer"], source: "evidence-report.md:179", asOf: V },
    // Frontend
    { name: "Next.js", lane: "frontend", usedIn: ["eventora", "recruiter-pro"], source: "evidence-report.md:117,157", asOf: V },
    { name: "React", lane: "frontend", usedIn: ["eventora", "recruiter-pro"], source: "evidence-report.md:117,157", asOf: V },
    { name: "TypeScript", lane: "frontend", usedIn: ["eventora", "recruiter-pro"], source: "evidence-report.md:117; Recruiter-Pro/frontend/package.json:30", asOf: V },
    { name: "Tailwind CSS", lane: "frontend", usedIn: ["eventora"], source: "evidence-report.md:117", asOf: V },
    { name: "Vitest", lane: "frontend", usedIn: ["eventora"], source: "evidence-report.md:117", asOf: V },
  ])
  .map((c) => {
    // Every usedIn entry must be a known project slug, except labelled non-repo work.
    const slugs = new Set(projects.map((p) => p.slug));
    for (const u of c.usedIn) {
      if (!slugs.has(u) && !c.qualifier) throw new Error(`skills.ts: "${c.name}" usedIn unknown project "${u}"`);
    }
    return c;
  });

export type Skill = (typeof skills)[number];
export const lanes = lane.options;
