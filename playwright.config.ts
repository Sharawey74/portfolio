import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke tests against the production build (`next start`), not the dev server:
 * they check what visitors get. Build first (`npm run build`), then
 * `npm run test:smoke`. CI does both in the `smoke` job.
 */
const PORT = 3110;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // One `next start` serves every test; more workers than this time out
  // on image optimization rather than finding bugs.
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
