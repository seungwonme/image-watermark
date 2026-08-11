# Watermark Lab

이미지에 텍스트 또는 이미지 워터마크를 적용하고 원본 해상도로 내려받는 Next.js 서비스입니다.

## 주요 기능

- JPG, PNG, WebP, AVIF, GIF, SVG 다중 업로드
- 텍스트 워터마크: 반복/가운데/오른쪽 아래 배치, 색상, 크기, 불투명도, 간격, 각도
- 이미지 워터마크: PNG/SVG 로고, 크기, 불투명도, 간격, 각도
- 눈누 21종, Google Fonts 51종, 시스템 글꼴, WOFF/WOFF2/TTF/OTF 직접 추가
- PNG, JPG, WebP 저장과 여러 이미지 ZIP 다운로드
- 반응형 UI, 라이트/다크 테마, 키보드 접근성

## 시작하기

```bash
pnpm install
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 검증 명령

```bash
pnpm typecheck   # TypeScript strict 검사
pnpm lint        # Biome 검사
pnpm lint:fsd    # Feature-Sliced Design 레이어 검사
pnpm test        # Vitest 단위 테스트
pnpm test:e2e    # Playwright 브라우저 테스트
pnpm build       # Next.js 프로덕션 빌드
```

## 구조

```text
app/                                  # Next.js App Router
src/pages/home/                       # 페이지 조합
src/features/watermark-editor/
├── config/font-catalog.ts            # 눈누/Google 글꼴 카탈로그
├── lib/canvas-renderer.ts            # Canvas 렌더링과 출력
├── lib/font-loader.ts                # 선택 글꼴 지연 로딩
├── model/                            # 편집 상태와 타입
└── ui/                               # 작업 영역과 설정 패널
tests/unit/                           # 렌더러 단위 테스트
tests/e2e/                            # 업로드/다운로드 E2E
```

## 글꼴 이용 조건

글꼴 선택기에서 각 글꼴의 이용 조건 페이지를 열 수 있습니다. 눈누 글꼴은 버전이 고정된 배포 파일을 사용하며, Google Fonts는 CSS2 API로 선택한 글꼴만 불러옵니다. 직접 추가한 글꼴의 사용 권한은 파일 보유자가 확인해야 합니다.

## 이미지 한도

브라우저 Canvas 호환 범위에 맞춰 내보내기는 가로/세로 32,767px 이하, 총 1억 픽셀 이하를 지원합니다. 미리보기는 긴 변 1,600px로 축소하며 다운로드는 원본 크기로 다시 렌더링합니다.

## 기술 스택

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, shadcn/ui 기반 Button, next-themes
- JSZip, Vitest, Playwright, Biome, Steiger

## 링크

- GitHub: [seungwonme/image-watermark](https://github.com/seungwonme/image-watermark)
