import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { SectionHeading } from "@/components/ui/section-heading.tsx";
import { contactConfigured } from "@/lib/contact-config.ts";
import { ContactForm } from "./contact-form.tsx";

/**
 * 05 / Contact. The form, on a section card (Stage 7: the deep accent band is
 * retired, docs/ISSUES.md ISS-42), renders only when the deployment has the
 * Resend variables; otherwise a plain notice points to the direct links, which
 * sit just above, under the closing line. Availability appears once set in
 * personal.ts.
 */
export function ContactSection() {
  const { ui, sections } = profile;
  const t = ui.contact;
  const section = sections.find((s) => s.id === "contact")!;
  const configured = contactConfigured();

  return (
    <section aria-labelledby="contact" className="grid-12 gap-y-16 pt-8 pb-24 md:pb-32">
      <SectionHeading id="contact" index={section.index} title={section.title} />

      <div className="col-span-full flex flex-col gap-4 md:col-span-4 md:col-start-2">
        <p className="max-w-[40ch] text-ink-2">{configured ? t.lead : t.notConfigured}</p>
        {personal.availability.value ? <p className="text-small text-ink-2">{personal.availability.value}</p> : null}
      </div>

      {configured ? (
        <div className="surface-card rise col-span-full p-6 md:col-span-6 md:col-start-6 md:p-8">
          <ContactForm
            labels={{
              name: t.name,
              email: t.email,
              message: t.message,
              messageHint: t.messageHint,
              send: t.send,
              sending: t.sending,
              sent: t.sent,
              invalid: t.invalid,
              failed: t.failed,
              limited: t.limited,
              notConfigured: t.notConfigured,
              honeypot: t.honeypot,
              required: t.required,
            }}
          />
        </div>
      ) : null}
    </section>
  );
}
