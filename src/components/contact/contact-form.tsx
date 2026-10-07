"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContact, type ContactState } from "@/app/actions/contact.ts";

type Labels = {
  name: string;
  email: string;
  message: string;
  messageHint: string;
  send: string;
  sending: string;
  sent: string;
  invalid: string;
  failed: string;
  limited: string;
  notConfigured: string;
  honeypot: string;
  required: string;
};

/**
 * Contact form on a Server Action. Without JavaScript it is a plain POST and
 * the page re-renders with the result. Native constraints (required, type,
 * minlength, maxlength) give the first line of feedback, styled only after
 * interaction (:user-invalid); the server re-validates and its field errors set
 * aria-invalid. The status line is a live region; on an error, focus moves to
 * the first invalid field.
 */
export function ContactForm({ labels }: { labels: Labels }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "invalid") form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  const kept = "values" in state ? state.values : undefined;
  const bad = (f: "name" | "email" | "message") => state.status === "invalid" && state.fields[f] === true;

  const message =
    state.status === "sent"
      ? labels.sent
      : state.status === "invalid"
        ? labels.invalid
        : state.status === "failed"
          ? labels.failed
          : state.status === "limited"
            ? labels.limited
            : state.status === "not-configured"
              ? labels.notConfigured
              : "";

  return (
    <form ref={form} key={"at" in state ? state.at : 0} action={action} className="contact-form flex flex-col gap-6">
      <div className="field">
        <label htmlFor="cf-name" className="mono-label text-ink-2">
          {labels.name} <span className="text-ink-3">({labels.required})</span>
        </label>
        <input id="cf-name" name="name" type="text" required maxLength={100} autoComplete="name" enterKeyHint="next" defaultValue={kept?.name} aria-invalid={bad("name") || undefined} />
      </div>
      <div className="field">
        <label htmlFor="cf-email" className="mono-label text-ink-2">
          {labels.email} <span className="text-ink-3">({labels.required})</span>
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="next"
          defaultValue={kept?.email}
          aria-invalid={bad("email") || undefined}
        />
      </div>
      <div className="field">
        <label htmlFor="cf-message" className="mono-label text-ink-2">
          {labels.message} <span className="text-ink-3">({labels.required})</span>
        </label>
        <textarea id="cf-message" name="message" required minLength={10} maxLength={4000} rows={6} aria-describedby="cf-message-hint" defaultValue={kept?.message} aria-invalid={bad("message") || undefined} />
        <p id="cf-message-hint" className="font-mono text-mono text-ink-3">
          {labels.messageHint}
        </p>
      </div>
      {/* Honeypot: off-screen and out of the tab order; bots fill it, people do not. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-company">{labels.honeypot}</label>
        <input id="cf-company" name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center gap-3 rounded-xs bg-ink px-5 text-small font-medium text-page transition-[background-color] duration-200 ease-out hover:bg-ink-soft disabled:cursor-progress disabled:bg-ink-2"
        >
          {pending ? labels.sending : labels.send} <span aria-hidden="true">→</span>
        </button>
        <p role="status" aria-live="polite" className="text-small text-ink-2">
          {state.status !== "idle" ? (
            <>
              <span aria-hidden="true" className="mr-2 font-mono">
                {state.status === "sent" ? "✓" : "○"}
              </span>
              {message}
            </>
          ) : null}
        </p>
      </div>
    </form>
  );
}
