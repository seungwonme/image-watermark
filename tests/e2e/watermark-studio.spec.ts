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
    page.getByRole("link", { name: "Watermark Lab 편집기" }),
  ).toBeVisible();
  await page.locator('input[type="file"][multiple]').setInputFiles({
    name: "sample.svg",
    mimeType: "image/svg+xml",
    buffer: SOURCE_SVG,
  });

  const previewCanvas = page.getByRole("img", {
    name: "sample.svg 워터마크 미리보기",
  });
  await expect(previewCanvas).toBeVisible();
  await expect(previewCanvas).toHaveJSProperty("width", 640);
  await expect(previewCanvas).toHaveJSProperty("height", 420);
  await expect
    .poll(() =>
      previewCanvas.evaluate((canvas) => {
        const context = (canvas as HTMLCanvasElement).getContext("2d");
        return context?.getImageData(320, 210, 1, 1).data[3] ?? 0;
      }),
    )
    .toBeGreaterThan(0);
  await page.getByLabel("워터마크 문구").fill("AIDEN SAMPLE");

  await page.getByRole("button", { name: /시스템 고딕/ }).click();
  await page.getByLabel("글꼴 이름 검색").fill("시스템 명조");
  await page.getByRole("button", { name: /시스템 명조/ }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "현재 이미지 다운로드" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("sample-watermarked.png");
});

test("눈누 글꼴을 카테고리와 이름으로 찾고 인기순으로 선택한다", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: /시스템 고딕/ }).click();
  await expect(page.getByRole("dialog", { name: "글꼴 선택" })).toBeVisible();
  await expect(
    page.locator('[data-font-preview-id="noonnu-pretendard"]'),
  ).toHaveCSS("font-family", /WM Pretendard/);
  await page.getByRole("button", { name: /^눈누 49$/ }).click();
  await page.getByRole("button", { name: /^손글씨/ }).click();
  await page.getByLabel("글꼴 이름 검색").fill("프롬솔");

  const fontButton = page.getByRole("button", { name: /그리운 프롬솔/ });
  await expect(fontButton).toContainText("인기 5위");
  await fontButton.click();
  await expect(
    page.getByRole("button", { name: /그리운 프롬솔/ }),
  ).toBeVisible();
});

test("메인 편집기와 별도 사용법 페이지를 제공한다", async ({ page }) => {
  await page.goto("/");

  const canonicalUrl = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonicalUrl).not.toBeNull();
  expect(new URL(canonicalUrl ?? "").pathname).toBe("/");
  await expect(
    page.getByRole("heading", { name: "이미지 워터마크 만들기" }),
  ).toBeAttached();
  await expect(
    page.getByRole("heading", {
      name: "세 단계면 워터마크가 완성됩니다",
    }),
  ).toHaveCount(0);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    2,
  );

  await page.getByRole("link", { name: "사용법" }).click();
  await expect(page).toHaveURL(/\/guide$/);
  await expect(
    page.getByRole("heading", {
      name: "세 단계면 워터마크가 완성됩니다",
    }),
  ).toBeVisible();
  const guideCanonicalUrl = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(new URL(guideCanonicalUrl ?? "").pathname).toBe("/guide");
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    2,
  );
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

  const fontTrigger = page.getByRole("button", {
    name: /시스템 고딕/,
  });
  await fontTrigger.click();
  const dialog = page.getByRole("dialog", { name: "글꼴 선택" });
  await expect(dialog.getByRole("button", { name: "닫기" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(
    await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(fontTrigger).toBeFocused();
});

test("빈 캔버스로 업로드 없이 워터마크를 만든다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "캔버스 추가" }).click();

  // 기본값 1080x1920은 MAX_PREVIEW_DIMENSION 1600에 맞춰 900x1600으로 축소된다.
  // SVG에서 width/height를 빠뜨리면 여기가 84x150이 되므로 회귀 감지 장치다.
  const previewCanvas = page.getByRole("img", {
    name: "blank-1080x1920-ffffff.svg 워터마크 미리보기",
  });
  await expect(previewCanvas).toBeVisible();
  await expect(previewCanvas).toHaveJSProperty("width", 900);
  await expect(previewCanvas).toHaveJSProperty("height", 1600);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "현재 이미지 다운로드" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(
    "blank-1080x1920-ffffff-watermarked.png",
  );
});

test("빈 캔버스의 가로 세로와 배경색을 직접 정한다", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("빈 캔버스 가로").fill("800");
  await page.getByLabel("빈 캔버스 세로").fill("600");
  // 색상 선택기는 타이핑할 수 없다. React의 value tracker가 직접 대입을
  // 무시하므로 네이티브 setter로 값을 넣은 뒤 input 이벤트를 발생시킨다.
  await page.getByLabel("빈 캔버스 배경색").evaluate((input) => {
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    setValue?.call(input, "#000000");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByRole("button", { name: "캔버스 추가" }).click();

  const previewCanvas = page.getByRole("img", {
    name: "blank-800x600-000000.svg 워터마크 미리보기",
  });
  await expect(previewCanvas).toHaveJSProperty("width", 800);
  await expect(previewCanvas).toHaveJSProperty("height", 600);
  // 어두운 배경이면 워터마크 글자색이 흰색으로 자동 전환된다.
  await expect(page.getByLabel("워터마크 색상 HEX 값")).toHaveValue("#FFFFFF");

  await page.getByRole("button", { name: "가로 세로 바꾸기" }).click();
  await expect(page.getByLabel("빈 캔버스 가로")).toHaveValue("600");
  await expect(page.getByLabel("빈 캔버스 세로")).toHaveValue("800");
});
