import { z } from "zod";
import { claim, source, asOf } from "./schema.ts";

/**
 * Roles, education and certifications.
 * Certifications carry no dates anywhere, by owner decision.
 * The Telecom Egypt role must not carry the Docker CI/CD or prompt-engineering
 * bullets from older resumes.
 */

const month = z.string().regex(/^\d{4}-\d{2}$/);

const role = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  org: z.string().min(1),
  start: month,
  end: month,
  points: z.array(claim).min(1),
  /** Slugs from projects.ts produced in this role. */
  projects: z.array(z.string()),
  source,
  asOf,
});

const certification = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  source,
  asOf,
});

const experienceSchema = z.object({
  roles: z.array(role),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      start: month,
      end: month,
      source,
      asOf,
    }),
  ),
  certifications: z.array(certification),
  /** Hidden: the owner keeps the capstone off the site (2026-10-10, ISS-47). */
  capstone: z.object({ withheld: z.iso.date() }),
});

const RESUME_SECTION = "evidence-report.md:408 (newest resume, roles and dates)";
const APPROVED = "owner:approved-claims";
/** The owner's resume, shared on the asOf date for the Alstom internship and the Anthropic Academy certificates only (ISS-19, ISS-20). */
const RESUME_2026_10 = "owner:resume";
const VERIFIED = "2026-10-06";

export const experience = experienceSchema.parse({
  roles: [
    {
      id: "alstom",
      title: "Systems Engineering Intern",
      org: "Alstom",
      start: "2026-08",
      end: "2026-09",
      points: [
        { text: "Cairo Monorail (CITYFLO 650 CBTC): diagnosed in-service faults on the driverless line by tracing 10+ subsystem interfaces (ATS, interlocking, ATP/ATO, platform screen doors, SCADA) and rebuilding event timelines from onboard and wayside logs to separate root causes from symptoms.", source: RESUME_2026_10, asOf: "2026-10-10" },
        { text: "Audited 660 pages of wayside and onboard maintenance manuals against the as-built architecture: a register of 78 findings (11 critical), each checked against its source document through 150+ scripted text checks.", source: RESUME_2026_10, asOf: "2026-10-10" },
        { text: "AI/ML sprint on railway incident data: framed the problem of 5 incompatible alarm formats feeding one operator screen, set 5 data-quality metrics, and proposed a unified incident taxonomy and classification approach.", source: RESUME_2026_10, asOf: "2026-10-10" },
      ],
      projects: [],
      source: RESUME_2026_10,
      asOf: "2026-10-10",
    },
    {
      id: "orascom",
      title: "IT Infrastructure Intern",
      org: "Orascom Construction PLC",
      // July only: the owner's decision (2026-10-10), from the resume; the
      // evidence report had July to August (FACTS-CHECK.md).
      start: "2026-07",
      end: "2026-07",
      points: [
        { text: "CCNA-aligned networking: routing, VLAN segmentation, NAT, IP addressing, switching.", source: APPROVED, asOf: VERIFIED },
        { text: "Guided data-center rack walkthrough: firewall, servers, UPS.", source: APPROVED, asOf: VERIFIED },
      ],
      projects: [],
      source: RESUME_SECTION,
      asOf: VERIFIED,
    },
    {
      id: "telecom-egypt",
      title: "AI/ML Intern",
      org: "Telecom Egypt (WE)",
      start: "2025-07",
      end: "2025-09",
      points: [
        { text: "Delivered 2 AI-enhanced data-processing prototypes with supervised and unsupervised ML; one was PhishSniffer.", source: APPROVED, asOf: VERIFIED },
        { text: "EDA, preprocessing, and evaluation with precision, recall, F1 and cross-validation.", source: APPROVED, asOf: VERIFIED },
      ],
      projects: ["phishsniffer"],
      source: RESUME_SECTION,
      asOf: VERIFIED,
    },
  ],
  education: [
    {
      school: "Arab Academy for Science, Technology and Maritime Transport (AASTMT)",
      degree: "B.Sc. Software Engineering",
      start: "2023-09",
      end: "2027-06",
      source: APPROVED,
      asOf: VERIFIED,
    },
  ],
  certifications: [
    { name: "Claude 101, Claude Code 101, Claude Code in Action, Agent Skills, Subagents", issuer: "Anthropic Academy", source: RESUME_2026_10, asOf: "2026-10-10" },
    { name: "GenAI Practice", issuer: "NVIDIA", source: "evidence-report.md:408", asOf: VERIFIED },
    { name: "Building LLM Applications with Prompt Engineering", issuer: "NVIDIA", source: "evidence-report.md:408", asOf: VERIFIED },
    { name: "AI Associate", issuer: "Telecom Egypt", source: "evidence-report.md:408", asOf: VERIFIED },
    { name: "DevOps Foundations", issuer: "Sprints", source: "evidence-report.md:408", asOf: VERIFIED },
  ],
  capstone: { withheld: "2026-10-10" },
});

export type Experience = typeof experience;
