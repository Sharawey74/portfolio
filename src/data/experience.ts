import { z } from "zod";
import { claim, source, asOf, todo } from "./schema.ts";

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
  /** Hidden until the owner fills it in. */
  capstone: z.object({ todo }),
});

const RESUME_SECTION = "evidence-report.md:408 (newest resume, roles and dates)";
const APPROVED = "owner:approved-claims";
const VERIFIED = "2026-10-06";

export const experience = experienceSchema.parse({
  roles: [
    {
      id: "orascom",
      title: "IT Infrastructure Intern",
      org: "Orascom Construction PLC",
      start: "2026-07",
      end: "2026-08",
      points: [
        { text: "CCNA-aligned networking: routing, VLAN segmentation, NAT, IP addressing, switching.", source: APPROVED, asOf: VERIFIED },
        { text: "Copper and fiber cabling.", source: APPROVED, asOf: VERIFIED },
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
    { name: "GenAI Practice", issuer: "NVIDIA", source: "evidence-report.md:408", asOf: VERIFIED },
    { name: "Building LLM Applications with Prompt Engineering", issuer: "NVIDIA", source: "evidence-report.md:408", asOf: VERIFIED },
    { name: "AI Associate", issuer: "Telecom Egypt", source: "evidence-report.md:408", asOf: VERIFIED },
    { name: "DevOps Foundations", issuer: "Sprints", source: "evidence-report.md:408", asOf: VERIFIED },
  ],
  capstone: { todo: "TODO(owner): final-year FinTech capstone, hidden until described" },
});

export type Experience = typeof experience;
