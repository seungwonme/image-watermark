import { WatermarkStudio } from "@/features/watermark-editor";
import {
  createWebApplicationJsonLd,
  createWebSiteJsonLd,
  JsonLd,
} from "@/shared/lib";

export function HomePage() {
  return (
    <>
      <JsonLd data={createWebSiteJsonLd()} />
      <JsonLd data={createWebApplicationJsonLd()} />
      <h1 className="sr-only">이미지 워터마크 만들기</h1>
      <WatermarkStudio />
    </>
  );
}
