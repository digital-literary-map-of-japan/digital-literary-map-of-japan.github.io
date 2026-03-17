import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3105";

test.describe("SEO: メタタグ・canonical", () => {
  test("トップページに必須メタタグがある", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    // title
    const title = await page.title();
    expect(title).toContain("Digital Literary Map of Japan");

    // description
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content", /.+/);

    // canonical（trailing slash 付き）
    const canonical = page.locator('link[rel="canonical"]');
    const href = await canonical.getAttribute("href");
    expect(href).toMatch(/\/$/);

    // og:locale
    const ogLocale = page.locator('meta[property="og:locale"]');
    await expect(ogLocale).toHaveAttribute("content", "ja_JP");

    // og:locale:alternate
    const ogAlt = page.locator('meta[property="og:locale:alternate"]');
    await expect(ogAlt).toHaveAttribute("content", "en_US");
  });

  test("英語ページの canonical に trailing slash がある", async ({ page }) => {
    await page.goto(`${BASE_URL}/en/`, { waitUntil: "networkidle" });

    const canonical = page.locator('link[rel="canonical"]');
    const href = await canonical.getAttribute("href");
    expect(href).toMatch(/\/en\/$/);
  });
});

test.describe("SEO: 構造化データ（JSON-LD）", () => {
  test("トップページに WebSite JSON-LD がある", async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    expect(count).toBeGreaterThan(0);

    let foundWebSite = false;
    for (let i = 0; i < count; i++) {
      const text = await jsonLdScripts.nth(i).textContent();
      if (text) {
        const data = JSON.parse(text);
        if (data["@type"] === "WebSite") {
          foundWebSite = true;
          expect(data.name).toBeTruthy();
          expect(data.url).toBeTruthy();
          expect(data.publisher).toBeTruthy();
        }
      }
    }
    expect(foundWebSite).toBe(true);
  });

  test("スポットページに Place JSON-LD がある", async ({ page }) => {
    // spots一覧からリンクを取得して最初のスポットに遷移
    await page.goto(`${BASE_URL}/spots/?layout=table`, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(2000);

    // テーブル内の最初のリンクを取得
    const firstLink = page.locator("table a[href*='/spots/']").first();
    const href = await firstLink.getAttribute("href");
    expect(href).toBeTruthy();

    await page.goto(`${BASE_URL}${href}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // JSON-LD を検証
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();

    let foundPlace = false;
    let foundBreadcrumb = false;
    for (let i = 0; i < count; i++) {
      const text = await jsonLdScripts.nth(i).textContent();
      if (text) {
        const data = JSON.parse(text);
        if (data["@type"] === "Place") {
          foundPlace = true;
          expect(data.name).toBeTruthy();
          expect(data.geo).toBeTruthy();
          expect(data.geo.latitude).toBeGreaterThan(0);
          expect(data.geo.longitude).toBeGreaterThan(0);
        }
        if (data["@type"] === "BreadcrumbList") {
          foundBreadcrumb = true;
          expect(data.itemListElement.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
    expect(foundPlace).toBe(true);
    expect(foundBreadcrumb).toBe(true);
  });

  test("データセットページに Dataset JSON-LD がある", async ({ page }) => {
    await page.goto(`${BASE_URL}/dataset/`, { waitUntil: "networkidle" });

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();

    let foundDataset = false;
    for (let i = 0; i < count; i++) {
      const text = await jsonLdScripts.nth(i).textContent();
      if (text) {
        const data = JSON.parse(text);
        if (data["@type"] === "Dataset") {
          foundDataset = true;
          expect(data.name).toBeTruthy();
          expect(data.license).toContain("creativecommons.org");
          expect(data.distribution).toBeTruthy();
          expect(data.url).toMatch(/\/$/);
        }
      }
    }
    expect(foundDataset).toBe(true);
  });
});

test.describe("SEO: robots・noindex", () => {
  test("管理ページに noindex がある", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/`, { waitUntil: "networkidle" });

    const robots = page.locator('meta[name="robots"]');
    const content = await robots.getAttribute("content");
    expect(content).toContain("noindex");
  });
});

test.describe("SEO: trailing slash リダイレクト", () => {
  test("trailing slash なしの URL がリダイレクトされる", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/contact`, {
      waitUntil: "networkidle",
    });

    // 最終URLが trailing slash 付きであること
    expect(page.url()).toMatch(/\/contact\/$/);
  });
});
