import { caseStudies, secondaryProjects } from "@/data/projects.ts";
import { oss, prUrl } from "@/data/oss.ts";
import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { PaletteDialog, type PaletteItem } from "./palette-dialog.tsx";

const host = (href: string) => new URL(href).hostname.replace(/^www\./, "");

/**
 * Builds the palette's entries from the data files (server side), so the
 * client bundle carries only the resulting list. Only live sections, set
 * personal links and an existing resume appear.
 */
export function CommandPalette() {
  const { ui, sections } = profile;

  const items: PaletteItem[] = [
    ...sections
      .filter((s) => s.live)
      .map((s): PaletteItem => ({ id: `s-${s.id}`, group: "sections", kind: "section", target: s.id, label: s.title, hint: s.index })),
    ...caseStudies.map((p): PaletteItem => ({
      id: `p-${p.slug}`,
      group: "projects",
      kind: "page",
      href: `/projects/${p.slug}`,
      label: p.name,
      hint: ui.caseStudy,
    })),
    ...secondaryProjects.flatMap((p): PaletteItem[] => {
      const repo = p.links.find((l) => l.kind === "repo");
      return repo ? [{ id: `p-${p.slug}`, group: "projects", kind: "external", href: repo.href, label: p.name, hint: host(repo.href) }] : [];
    }),
    ...oss.pullRequests.map((pr): PaletteItem => ({
      id: `o-${pr.repo}-${pr.number}`,
      group: "openSource",
      kind: "external",
      href: prUrl(pr),
      label: pr.title,
      hint: `${pr.repo.split("/")[1]}#${pr.number}`,
      keywords: pr.repo,
    })),
    { id: "l-github", group: "links", kind: "external", href: personal.github.href, label: "GitHub", hint: host(personal.github.href) },
    { id: "l-linkedin", group: "links", kind: "external", href: personal.linkedin.href, label: "LinkedIn", hint: host(personal.linkedin.href) },
    ...(personal.email.value
      ? [{ id: "l-email", group: "links", kind: "external", href: `mailto:${personal.email.value}`, label: ui.palette.email, hint: personal.email.value } as const]
      : []),
    ...(personal.resumePdf.value
      ? [{ id: "l-resume", group: "links", kind: "external", href: personal.resumePdf.value, label: ui.palette.resume, hint: "PDF" } as const]
      : []),
    { id: "a-theme", group: "actions", kind: "action", action: "theme", label: ui.palette.toggleTheme, keywords: "dark light" },
    { id: "a-pause", group: "actions", kind: "action", action: "pause", label: ui.pauseAnimations, keywords: "motion play stop" },
  ];

  return (
    <PaletteDialog
      items={items}
      labels={{
        title: ui.palette.title,
        placeholder: ui.palette.placeholder,
        empty: ui.palette.empty,
        hint: ui.palette.hint,
        groups: ui.palette.groups,
        pause: ui.pauseAnimations,
        play: ui.playAnimations,
      }}
    />
  );
}
