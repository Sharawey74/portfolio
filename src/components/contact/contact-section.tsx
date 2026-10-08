import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { SectionHeading } from "@/components/ui/section-heading.tsx";
import { ScrambleText } from "@/components/motion/scramble.tsx";
import { BrandIcon, type IconKind } from "@/components/ui/brand-icon.tsx";
import { contactConfigured } from "@/lib/contact-config.ts";
import { ContactForm } from "./contact-form.tsx";

/**
 * 05 / Contact. The form renders only when the deployment has the Resend
 * variables; otherwise a plain notice says so and the direct links carry the
 * section. Email, phone and availability appear only once set in personal.ts.
 * The section sits on the deep accent band (--c1), the page's one large use
 * of the accent ramp (docs/ISSUES.md ISS-21); hairlines turn --c2 inside it.
 */
export function ContactSection() {
  const { ui, sections } = profile;
  const t = ui.contact;
  const section = sections.find((s) => s.id === "contact")!;
  const configured = contactConfigured();

  const links: { label: string; href: string; icon?: IconKind }[] = [
    ...(personal.email.value ? [{ label: personal.email.value, href: `mailto:${personal.email.value}`, icon: "email" as const }] : []),
    ...(personal.phone.value ? [{ label: personal.phone.value, href: `tel:${personal.phone.value.replace(/\s+/g, "")}` }] : []),
    { label: `GitHub / ${personal.github.handle}`, href: personal.github.href, icon: "github" },
    { label: "LinkedIn", href: personal.linkedin.href, icon: "linkedin" },
  ];

  return (
    <div className="contact-band">
    <section aria-labelledby="contact" className="grid-12 gap-y-16 py-24 md:py-32">
      <SectionHeading id="contact" index={section.index} title={section.title} />

      <div className="col-span-full flex flex-col gap-8 md:col-span-6 md:col-start-2">
        {configured ? (
          <>
            <p className="max-w-[48ch] text-ink-2">{t.lead}</p>
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
          </>
        ) : (
          <p className="max-w-[48ch] border-t border-hair pt-6 text-ink-2">
            <span aria-hidden="true" className="mr-2 font-mono text-ink-3">○</span>
            {t.notConfigured}
          </p>
        )}
      </div>

      <div className="col-span-full flex flex-col gap-4 md:col-span-3 md:col-start-9">
        <ul className="flex flex-col" aria-label={t.direct}>
          {links.map((l) => {
            const external = l.href.startsWith("https://");
            return (
              <li key={l.href} className="border-t border-hair">
                <a href={l.href} rel={external ? "noreferrer" : undefined} className="contact-link font-mono text-mono-lg">
                  <span className="flex min-w-0 items-center gap-3">
                    {l.icon ? <BrandIcon kind={l.icon} /> : null}
                    <ScrambleText text={l.label} />
                  </span>
                  <span aria-hidden="true">{external ? "↗" : "→"}</span>
                  {external ? <span className="sr-only"> ({ui.externalLink})</span> : null}
                </a>
              </li>
            );
          })}
        </ul>
        {personal.availability.value ? <p className="text-small text-ink-2">{personal.availability.value}</p> : null}
      </div>
    </section>
    </div>
  );
}
