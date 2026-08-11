import { expect, test } from "@playwright/test";

const SOURCE_SVG = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0f2747" />
        <stop offset="1" stop-color="#da7756" />
      </linearGradient>
    </defs>
    <rect width="640" height="420" fill="url(#g)" />
    <circle cx="490" cy="110" r="70" fill="#f1d7a8" />
  </svg>
`);

const LOGO_SVG = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80">
    <rect width="160" height="80" rx="18" fill="#d8ff5f" />
    <path d="M28 22h18v36H28zM52 22h18v36H52z" fill="#111" />
  </svg>
`);

test("텍스트 워터마크를 편집하고 원본 해상도로 다운로드한다", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "WATERMARK LAB" }),
  ).toBeVisible();
  await page.locator('input[type="file"][multiple]').setInputFiles({
    name: "sample.svg",
    mimeType: "image/svg+xml",
    buffer: SOURCE_SVG,
  });

  await expect(
    page.getByRole("img", { name: "sample.svg 워터마크 미리보기" }),
  ).toBeVisible();
  await page.getByLabel("워터마크 문구").fill("AIDEN SAMPLE");

  await page.getByRole("button", { name: /프리텐다드/ }).click();
  await page.getByLabel("글꼴 이름 검색").fill("Apple SD");
  await page.getByRole("option", { name: /Apple SD 산돌고딕 Neo/ }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "현재 이미지 다운로드" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("sample-watermarked.png");
});

test("여러 이미지와 이미지 워터마크를 ZIP으로 저장한다", async ({ page }) => {
  await page.goto("/");
  await page.locator('input[type="file"][multiple]').setInputFiles([
    { name: "first.svg", mimeType: "image/svg+xml", buffer: SOURCE_SVG },
    { name: "second.svg", mimeType: "image/svg+xml", buffer: SOURCE_SVG },
  ]);

  await page.getByRole("button", { name: "이미지 워터마크" }).click();
  await page
    .locator('input[type="file"]:not([multiple])')
    .last()
    .setInputFiles({
      name: "logo.svg",
      mimeType: "image/svg+xml",
      buffer: LOGO_SVG,
    });
  await expect(page.getByText("logo.svg")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "2장 ZIP으로 받기" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("watermarked-images.zip");
});

test("모바일 화면에서도 업로드와 설정 패널을 사용할 수 있다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("button", { name: "이미지 추가" })).toBeVisible();
  await expect(page.getByLabel("워터마크 문구")).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
