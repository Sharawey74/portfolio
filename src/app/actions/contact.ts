"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { contactConfigured } from "@/lib/contact-config.ts";

type Values = { name: string; email: string; message: string };

/**
 * `at` changes on every response, so the form remounts with `values` as its
 * defaults: React resets a form after its action runs, and a rejected message
 * must not be lost.
 */
export type ContactState =
  | { status: "idle" }
  | { status: "sent"; at: number }
  | { status: "invalid"; at: number; values: Values; fields: Partial<Record<keyof Values, true>> }
  | { status: "limited" | "failed" | "not-configured"; at: number; values: Values };

const message = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(4000),
});

// Simple fixed-window limit per client address: 3 messages per 10 minutes.
// In memory, so it holds per server instance only; enough to slow a script,
// not a distributed attack. Resend's own limits sit behind it.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, { count: number; start: number }>();

function limited(key: string): boolean {
  const now = Date.now();
  for (const [k, v] of hits) if (now - v.start > WINDOW_MS) hits.delete(k);
  const entry = hits.get(key);
  if (!entry) {
    hits.set(key, { count: 1, start: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

/**
 * Contact form Server Action. Works without JavaScript (plain form POST).
 * Order: honeypot → configuration → validation → rate limit → send.
 * The message body is never logged.
 */
export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const at = Date.now();
  // Honeypot: real visitors never see or fill this field. Pretend success.
  if (String(form.get("company") ?? "") !== "") return { status: "sent", at };

  const values: Values = {
    name: String(form.get("name") ?? "").slice(0, 100),
    email: String(form.get("email") ?? "").slice(0, 254),
    message: String(form.get("message") ?? "").slice(0, 4000),
  };
  if (!contactConfigured()) return { status: "not-configured", at, values };

  const parsed = message.safeParse(values);
  if (!parsed.success) {
    const fields: Partial<Record<keyof Values, true>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "email" || key === "message") fields[key] = true;
    }
    return { status: "invalid", at, values, fields };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (limited(ip)) return { status: "limited", at, values };

  const { name, email, message: body } = parsed.data;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Portfolio message from ${name.replace(/\s+/g, " ")}`,
        text: `${body}\n\n-- \n${name} <${email}>`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`contact: Resend responded ${res.status}`);
      return { status: "failed", at, values };
    }
  } catch (err) {
    console.error(`contact: send failed (${err instanceof Error ? err.name : "unknown"})`);
    return { status: "failed", at, values };
  }
  return { status: "sent", at };
}
