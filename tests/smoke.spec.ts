import { expect, test, type Page } from "@playwright/test";

/**
 * Release smoke tests (PLAN.md Stage 6.2). They answer "does the built site
 * work for a visitor", not "is every detail right" (that is docs/UAT.md).
 */

const PAGES = ["/", "/projects/eventora", "/projects/recruiter-pro", "/projects/sysplex"];
const FILES = ["/sitemap.xml", "/robots.txt", "/opengraph-image", "/icon.svg"];

/** Collects console errors and uncaught exceptions for one page. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test.describe("routes", () => {
  for (const path of [...PAGES, ...FILES]) {
    test(`${path} returns 200`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
    });
  }

  test("an unknown path returns 404", async ({ request }) => {
    const res = await request.get("/no-such-page");
    expect(res.status()).toBe(404);
  });
});

test.describe("pages render without errors", () => {
  for (const path of PAGES) {
    test(`${path} has one h1 and no console errors`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });
  }
});

test("header navigation jumps to a section and marks it current", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Sections" });
  await nav.getByRole("link", { name: /Work/ }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeInViewport();
  await expect(nav.locator('[aria-current="true"]')).toContainText("Work");
});

test("work tabs switch projects and the open-source filter narrows the list", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const work = page.locator('section[aria-labelledby="work"]');
  await work.getByRole("tab", { name: "Recruiter-Pro" }).click();
  await expect(work.getByRole("heading", { level: 3, name: "Recruiter-Pro", exact: true })).toBeVisible();
  await expect(work.getByRole("heading", { level: 3, name: "Eventora", exact: true })).toBeHidden();
  const oss = page.locator('section[aria-labelledby="open-source"]');
  const rows = oss.locator("ul").first().locator(":scope > li");
  const all = await rows.count();
  await oss.getByRole("button", { name: /^Open/ }).click();
  const open = await rows.count();
  expect(open).toBeGreaterThan(0);
  expect(open).toBeLessThan(all);
  await expect(rows.getByText("Merged", { exact: true })).toHaveCount(0);
});

test.describe("content without motion or JavaScript", () => {
  test("reduced motion shows the hero and section titles statically", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Abdelrhman Mohamed");
    for (const title of ["About", "Work", "Open source", "Experience", "Contact"]) {
      await expect(page.getByRole("heading", { level: 2, name: title, exact: true })).toBeAttached();
    }
    await context.close();
  });

  test("JavaScript off still renders the content", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const name of ["Eventora", "Recruiter-Pro", "SysPlex"]) {
      await expect(page.getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
    }
    await page.goto("/projects/eventora");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await context.close();
  });
});

test.describe("phone width", () => {
  for (const path of PAGES) {
    test(`${path} has no horizontal scroll at 375 px`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(path);
      const [scrollWidth, innerWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });
  }
});
