import { z } from "zod";
import { todo } from "./schema.ts";

/**
 * Every personal field lives here and nowhere else.
 * A field with `value: null` renders nothing: no element, no placeholder.
 * The one exception is the resume button, which renders disabled until
 * `resumePdf.value` is set and `/public/resume.pdf` exists.
 * Personal fields are exempt from the `source` / `asOf` rule.
 * See PERSONAL-INFO-CHECKLIST.md for where each field appears.
 */

const field = z
  .object({
    value: z.string().min(1).nullable(),
    todo: todo.optional(),
  })
  .refine((f) => (f.value === null) === (f.todo !== undefined), {
    message: "set either value or todo, not both",
  });

const personalSchema = z.object({
  /** Spelling differs across files ("Abdelrahman" vs "Abdelrhman"); the owner decides. */
  name: field,
  email: field,
  /** Never rendered unless set. */
  phone: field,
  /** Path under /public, e.g. "/portrait.jpg". */
  portrait: field,
  location: field,
  bio: field,
  availability: field,
  gpa: field,
  /** "/resume.pdf" once the owner adds the file. */
  resumePdf: field,
  github: z.object({ handle: z.string(), href: z.url({ protocol: /^https$/ }) }),
  linkedin: z.object({ href: z.url({ protocol: /^https$/ }) }),
});

export const personal = personalSchema.parse({
  name: { value: null, todo: "TODO(owner): public name and its spelling (Abdelrahman or Abdelrhman)" },
  email: { value: null, todo: "TODO(owner): public contact email" },
  phone: { value: null, todo: "TODO(owner): phone number, only if it should be public" },
  portrait: { value: null, todo: "TODO(owner): portrait photo under /public" },
  location: { value: null, todo: "TODO(owner): location line" },
  bio: { value: null, todo: "TODO(owner): bio paragraph" },
  availability: { value: null, todo: "TODO(owner): availability line" },
  gpa: { value: null, todo: "TODO(owner): GPA, only if it should be public" },
  resumePdf: { value: null, todo: "TODO(owner): resume PDF at /public/resume.pdf" },
  github: { handle: "Sharawey74", href: "https://github.com/Sharawey74" },
  // Probe on 2026-10-06 returned 999 (LinkedIn's bot wall for non-browser clients).
  // Kept because the owner supplied it; see FACTS-CHECK.md.
  linkedin: { href: "https://www.linkedin.com/in/abdelrhman-mohamed-abdelhamied-6a59a1368" },
});

export type Personal = typeof personal;
