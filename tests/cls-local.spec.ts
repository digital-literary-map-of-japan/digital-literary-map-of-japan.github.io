import { test, expect } from "@playwright/test";

test("measure CLS on local build", async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__clsEntries = [];
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          (window as any).__clsEntries.push({
            value: (entry as any).value,
            sources: (entry as any).sources?.map((s: any) => ({
              node: s.node?.nodeName,
              classList: s.node?.className,
              previousRect: s.previousRect,
              currentRect: s.currentRect,
            })),
          });
        }
      }
    });
    observer.observe({ type: "layout-shift", buffered: true });
  });

  await page.goto("http://localhost:3200/en/", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(3000);

  const clsData = await page.evaluate(() => {
    const entries = (window as any).__clsEntries || [];
    const totalCLS = entries.reduce(
      (sum: number, e: any) => sum + e.value,
      0
    );
    return { totalCLS, entries };
  });

  console.log("\n=== CLS Report (Local Build) ===");
  console.log(`Total CLS: ${clsData.totalCLS.toFixed(4)}`);
  console.log(`Number of layout shifts: ${clsData.entries.length}`);

  for (const [i, entry] of clsData.entries.entries()) {
    console.log(`\nShift #${i + 1}: value=${entry.value.toFixed(4)}`);
    if (entry.sources) {
      for (const src of entry.sources) {
        console.log(`  Element: ${src.node} class="${src.classList}"`);
        console.log(`  Previous: ${JSON.stringify(src.previousRect)}`);
        console.log(`  Current:  ${JSON.stringify(src.currentRect)}`);
      }
    }
  }

  console.log(
    `\nCLS rating: ${clsData.totalCLS <= 0.1 ? "GOOD" : clsData.totalCLS <= 0.25 ? "NEEDS IMPROVEMENT" : "POOR"}`
  );
});

test("compare no-JS vs JS layout (local)", async ({ page }) => {
  // JS無効版
  await page.route("**/*", (route) => {
    if (route.request().resourceType() === "script") {
      return route.abort();
    }
    return route.continue();
  });

  await page.goto("http://localhost:3200/en/", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "tests/screenshots/local-no-js.png",
    fullPage: true,
  });
  console.log("Screenshot saved: tests/screenshots/local-no-js.png");
});

test("JS enabled layout (local)", async ({ page }) => {
  await page.goto("http://localhost:3200/en/", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(3000);
  await page.screenshot({
    path: "tests/screenshots/local-with-js.png",
    fullPage: true,
  });
  console.log("Screenshot saved: tests/screenshots/local-with-js.png");
});
