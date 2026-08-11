import type { FontCategory, FontOption } from "../model/types";

const GOOGLE_FONTS_LICENSE_URL = "https://fonts.google.com/attribution";

function googleFont(
  name: string,
  category: FontCategory,
  supportsKorean = true,
): FontOption {
  return {
    id: `google-${name.toLowerCase().replaceAll(" ", "-")}`,
    name,
    family: name,
    provider: "google",
    category,
    supportsKorean,
    licenseUrl: GOOGLE_FONTS_LICENSE_URL,
  };
}

const GOOGLE_KOREAN_FONTS: FontOption[] = [
  googleFont("Noto Sans KR", "gothic"),
  googleFont("Noto Serif KR", "serif"),
  googleFont("IBM Plex Sans KR", "gothic"),
  googleFont("42dot Sans", "gothic"),
  googleFont("Gowun Dodum", "gothic"),
  googleFont("Gowun Batang", "serif"),
  googleFont("Hahmlet", "serif"),
  googleFont("Nanum Gothic", "gothic"),
  googleFont("Nanum Myeongjo", "serif"),
  googleFont("Nanum Gothic Coding", "gothic"),
  googleFont("Nanum Pen Script", "handwriting"),
  googleFont("Nanum Brush Script", "handwriting"),
  googleFont("Black Han Sans", "display"),
  googleFont("Do Hyeon", "display"),
  googleFont("Jua", "display"),
  googleFont("Dongle", "handwriting"),
  googleFont("Bagel Fat One", "display"),
  googleFont("Gasoek One", "display"),
  googleFont("Gothic A1", "gothic"),
  googleFont("Song Myung", "serif"),
  googleFont("Stylish", "display"),
  googleFont("Poor Story", "handwriting"),
  googleFont("Cute Font", "handwriting"),
  googleFont("Hi Melody", "handwriting"),
  googleFont("Dokdo", "handwriting"),
  googleFont("East Sea Dokdo", "handwriting"),
  googleFont("Gaegu", "handwriting"),
  googleFont("Gamja Flower", "handwriting"),
  googleFont("Kirang Haerang", "display"),
  googleFont("Yeon Sung", "handwriting"),
  googleFont("Single Day", "handwriting"),
  googleFont("Black And White Picture", "display"),
  googleFont("Gugi", "display"),
  googleFont("Orbit", "display"),
  googleFont("Grandiflora One", "serif"),
  googleFont("Diphylleia", "serif"),
];

const GOOGLE_LATIN_FONTS: FontOption[] = [
  googleFont("Bebas Neue", "latin", false),
  googleFont("Playfair Display", "latin", false),
  googleFont("DM Serif Display", "latin", false),
  googleFont("Cormorant Garamond", "latin", false),
  googleFont("Oswald", "latin", false),
  googleFont("Montserrat", "latin", false),
  googleFont("Lora", "latin", false),
  googleFont("Pacifico", "latin", false),
  googleFont("Permanent Marker", "latin", false),
  googleFont("Righteous", "latin", false),
  googleFont("Bungee", "latin", false),
  googleFont("Archivo Black", "latin", false),
  googleFont("Anton", "latin", false),
  googleFont("Abril Fatface", "latin", false),
  googleFont("Caveat", "latin", false),
];

const NOONNU_FONTS: FontOption[] = [
  {
    id: "noonnu-pretendard",
    name: "프리텐다드",
    family: "WM Pretendard",
    provider: "noonnu",
    category: "gothic",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Regular.woff2",
    licenseUrl: "https://noonnu.cc/font_page/694",
  },
  {
    id: "noonnu-suit",
    name: "수트",
    family: "WM Suit",
    provider: "noonnu",
    category: "gothic",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Regular.woff2",
    licenseUrl: "https://noonnu.cc/font_page/845",
  },
  {
    id: "noonnu-freesentation",
    name: "프리젠테이션",
    family: "WM Freesentation",
    provider: "noonnu",
    category: "gothic",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2404@1.0/Freesentation-9Black.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1369",
  },
  {
    id: "noonnu-paperlogy",
    name: "페이퍼로지",
    family: "WM Paperlogy",
    provider: "noonnu",
    category: "display",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-8ExtraBold.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1456",
  },
  {
    id: "noonnu-basic-gothic",
    name: "눈누 기초고딕",
    family: "WM Noonnu Basic Gothic",
    provider: "noonnu",
    category: "gothic",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noon-2410@1.0/NoonnuBasicGothicRegular.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1496",
  },
  {
    id: "noonnu-seoul-alrim",
    name: "서울알림체",
    family: "WM Seoul Alrim",
    provider: "noonnu",
    category: "display",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2505-1@1.0/SeoulAlrimTTF-Heavy.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1604",
  },
  {
    id: "noonnu-the-jamsil",
    name: "더잠실체",
    family: "WM The Jamsil",
    provider: "noonnu",
    category: "gothic",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302_01@1.0/TheJamsil5Bold.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1127",
  },
  {
    id: "noonnu-maru-buri",
    name: "마루 부리",
    family: "WM Maru Buri",
    provider: "noonnu",
    category: "serif",
    supportsKorean: true,
    sourceUrl:
      "https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-Regular.woff2",
    licenseUrl: "https://noonnu.cc/font_page/487",
  },
  {
    id: "noonnu-eulyoo-1945",
    name: "을유1945",
    family: "WM Eulyoo 1945",
    provider: "noonnu",
    category: "serif",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2102-01@1.0/Eulyoo1945-Regular.woff",
    licenseUrl: "https://noonnu.cc/font_page/620",
  },
  {
    id: "noonnu-yes-myoungjo",
    name: "예스 명조",
    family: "WM Yes Myoungjo",
    provider: "noonnu",
    category: "serif",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_13@1.0/YESMyoungjo-Regular.woff",
    licenseUrl: "https://noonnu.cc/font_page/406",
  },
  {
    id: "noonnu-yeolrin-myoungjo",
    name: "열린명조",
    family: "WM Yeolrin Myoungjo",
    provider: "noonnu",
    category: "serif",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.1/YeolrinMyeongjo-Medium.woff",
    licenseUrl: "https://noonnu.cc/font_page/355",
  },
  {
    id: "noonnu-sun-batang",
    name: "순바탕",
    family: "WM Sun Batang",
    provider: "noonnu",
    category: "serif",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_eight@1.0/SunBatang-Light.woff",
    licenseUrl: "https://noonnu.cc/font_page/289",
  },
  {
    id: "noonnu-bookk-myoungjo",
    name: "부크크 명조",
    family: "WM Bookk Myoungjo",
    provider: "noonnu",
    category: "serif",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/BookkMyungjo-Bd.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1084",
  },
  {
    id: "noonnu-kimjungchul-myoungjo",
    name: "김정철명조",
    family: "WM Kimjungchul Myoungjo",
    provider: "noonnu",
    category: "serif",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302_01@1.0/KimjungchulMyungjo-Bold.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1117",
  },
  {
    id: "noonnu-bujangnim-nunchi",
    name: "부장님 눈치체",
    family: "WM Bujangnim Nunchi",
    provider: "noonnu",
    category: "handwriting",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/naverfont_02@1.0/Bujangnim_nunchi.woff",
    licenseUrl: "https://noonnu.cc/font_page/522",
  },
  {
    id: "noonnu-bareun-hippie",
    name: "바른히피체",
    family: "WM Bareun Hippie",
    provider: "noonnu",
    category: "handwriting",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/naverfont_01@1.0/Bareun_hipi.woff",
    licenseUrl: "https://noonnu.cc/font_page/514",
  },
  {
    id: "noonnu-bae-eunhye",
    name: "배은혜체",
    family: "WM Bae Eunhye",
    provider: "noonnu",
    category: "handwriting",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/naverfont_01@1.0/Beeunhye.woff",
    licenseUrl: "https://noonnu.cc/font_page/519",
  },
  {
    id: "noonnu-distort",
    name: "뒤틀림",
    family: "WM Distort",
    provider: "noonnu",
    category: "display",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607290358@distort-bold/distort-bold/Distort-Bold.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1903",
  },
  {
    id: "noonnu-pear-toucan",
    name: "페어 큰부리새",
    family: "WM Pear Toucan",
    provider: "noonnu",
    category: "display",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607101653@peartoucan-bold/peartoucan-bold/PearToucan-Regular.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1866",
  },
  {
    id: "noonnu-denki-chip",
    name: "전기칩 한글",
    family: "WM Denki Chip",
    provider: "noonnu",
    category: "display",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607161325@x10y12pxdenkichiphangul/x10y12pxdenkichiphangul/x10y12pxDenkiChipHangul.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1877",
  },
  {
    id: "noonnu-kmu-sungkok-serif",
    name: "국민대 성곡 세리프",
    family: "WM KMU Sungkok Serif",
    provider: "noonnu",
    category: "serif",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607101542@kmu80sungkokserif/kmu80sungkokserif/KMU80SungkokSerif.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1863",
  },
  {
    id: "noonnu-jayeon-sans",
    name: "자연산스",
    family: "WM Jayeon Sans",
    provider: "noonnu",
    category: "gothic",
    supportsKorean: true,
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607201621@jayeonsans-medium/jayeonsans-medium/JayeonSans-Regular.woff2",
    licenseUrl: "https://noonnu.cc/font_page/1900",
  },
];

const SYSTEM_FONTS: FontOption[] = [
  {
    id: "system-apple-sd-gothic",
    name: "Apple SD 산돌고딕 Neo",
    family: "Apple SD Gothic Neo",
    provider: "system",
    category: "gothic",
    supportsKorean: true,
  },
  {
    id: "system-serif",
    name: "시스템 명조",
    family: "serif",
    provider: "system",
    category: "serif",
    supportsKorean: true,
  },
];

export const FONT_CATALOG: FontOption[] = [
  ...NOONNU_FONTS,
  ...GOOGLE_KOREAN_FONTS,
  ...GOOGLE_LATIN_FONTS,
  ...SYSTEM_FONTS,
];

export const FONT_PROVIDER_LABELS = {
  google: "Google Fonts",
  noonnu: "눈누",
  system: "기본",
  local: "내 글꼴",
} as const;

export function findFontById(
  fontId: string,
  customFonts: FontOption[] = [],
): FontOption {
  return (
    customFonts.find((font) => font.id === fontId) ??
    FONT_CATALOG.find((font) => font.id === fontId) ??
    FONT_CATALOG[0]
  );
}
