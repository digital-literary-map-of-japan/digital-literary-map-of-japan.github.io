import { test, expect } from "@playwright/test";

test("verify romaji in poem dialog", async ({ page }) => {
  await page.goto(
    "http://localhost:3105/spots/664af96e9192d80cc0677300/",
    { waitUntil: "networkidle" }
  );
  await page.waitForTimeout(3000);

  // 「和歌・漢詩・俳諧」タブをクリック
  const poemsTab = page.locator(".v-btn:has-text('和歌')");
  await poemsTab.click();
  await page.waitForTimeout(3000);

  // テーブルが表示されたか確認
  const rows = await page.locator("tr").count();
  console.log(`\nテーブル行数: ${rows}`);

  // 「後撰（470）」ボタンをクリック
  const poemBtn = page.locator(".v-btn:has-text('後撰（470）')");
  const count = await poemBtn.count();
  console.log(`後撰（470）ボタン数: ${count}`);

  if (count > 0) {
    await poemBtn.first().click();
    await page.waitForTimeout(1000);

    // ダイアログのスクリーンショット
    await page.screenshot({
      path: "tests/screenshots/poem-dialog-romaji.png",
    });

    // ローマ字確認
    const romajiText = page.locator("text=Shirayama ni");
    const isVisible = await romajiText.isVisible();
    console.log(`ローマ字「Shirayama ni...」表示: ${isVisible ? "OK" : "NG"}`);
    expect(isVisible).toBe(true);
  } else {
    // デバッグ用：ページのテキスト
    await page.screenshot({
      path: "tests/screenshots/poems-tab.png",
      fullPage: true,
    });
    const text = await page.locator("body").innerText();
    console.log("Page text:", text.substring(0, 3000));
    expect(count).toBeGreaterThan(0);
  }
});
