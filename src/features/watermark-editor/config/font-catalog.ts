import type { FontCategory, FontOption } from "../model/types";

const GOOGLE_FONTS_LICENSE_URL = "https://fonts.google.com/attribution";

// 2026-08-11 Google Fonts 공식 metadata의 popularity 값입니다.
const GOOGLE_FONT_POPULARITY = {
  "Noto Sans KR": 32,
  "Nanum Gothic": 91,
  "Nanum Myeongjo": 184,
  "Noto Serif KR": 199,
  "Gothic A1": 244,
  "Nanum Gothic Coding": 321,
  "Black Han Sans": 337,
  "Nanum Pen Script": 394,
  Dongle: 417,
  Jua: 461,
  "Do Hyeon": 600,
  "Gowun Batang": 629,
  "Nanum Brush Script": 665,
  "IBM Plex Sans KR": 704,
  Hahmlet: 804,
  "Gowun Dodum": 839,
  "Gamja Flower": 908,
  Sunflower: 915,
  Gaegu: 961,
  "Song Myung": 999,
  "Bagel Fat One": 1009,
  "Asta Sans": 1086,
  Dokdo: 1141,
  "Hi Melody": 1175,
  Gugi: 1182,
  "Gasoek One": 1221,
  "East Sea Dokdo": 1236,
  "Poor Story": 1247,
  Stylish: 1279,
  "Cute Font": 1290,
  "Single Day": 1307,
  "Yeon Sung": 1318,
  Orbit: 1417,
  Diphylleia: 1422,
  "Kirang Haerang": 1574,
  "Black And White Picture": 1612,
  "Grandiflora One": 1840,
  Montserrat: 7,
  Oswald: 21,
  "Playfair Display": 27,
  "Archivo Black": 31,
  Lora: 39,
  "Bebas Neue": 44,
  "Cormorant Garamond": 75,
  Anton: 86,
  "DM Serif Display": 115,
  Caveat: 120,
  Pacifico: 132,
  Bungee: 134,
  "Abril Fatface": 163,
  "Permanent Marker": 200,
  Righteous: 229,
} as const;

function googleFont(
  name: keyof typeof GOOGLE_FONT_POPULARITY,
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
    popularityRank: GOOGLE_FONT_POPULARITY[name],
  };
}

const GOOGLE_KOREAN_POPULAR_FONTS: FontOption[] = [
  googleFont("Noto Sans KR", "gothic"),
  googleFont("Nanum Gothic", "gothic"),
  googleFont("Nanum Myeongjo", "serif"),
  googleFont("Noto Serif KR", "serif"),
  googleFont("Gothic A1", "gothic"),
  googleFont("Nanum Gothic Coding", "monospace"),
  googleFont("Black Han Sans", "display"),
  googleFont("Nanum Pen Script", "handwriting"),
  googleFont("Dongle", "gothic"),
  googleFont("Jua", "display"),
  googleFont("Do Hyeon", "display"),
  googleFont("Gowun Batang", "serif"),
  googleFont("Nanum Brush Script", "handwriting"),
  googleFont("IBM Plex Sans KR", "gothic"),
  googleFont("Hahmlet", "serif"),
  googleFont("Gowun Dodum", "gothic"),
  googleFont("Gamja Flower", "handwriting"),
  googleFont("Sunflower", "gothic"),
  googleFont("Gaegu", "handwriting"),
  googleFont("Song Myung", "serif"),
  googleFont("Bagel Fat One", "display"),
  googleFont("Asta Sans", "gothic"),
  googleFont("Dokdo", "display"),
  googleFont("Hi Melody", "handwriting"),
  googleFont("Gugi", "display"),
  googleFont("Gasoek One", "display"),
  googleFont("East Sea Dokdo", "handwriting"),
  googleFont("Poor Story", "display"),
  googleFont("Stylish", "gothic"),
  googleFont("Cute Font", "display"),
];

const GOOGLE_KOREAN_EXTRA_FONTS: FontOption[] = [
  googleFont("Kirang Haerang", "display"),
  googleFont("Yeon Sung", "handwriting"),
  googleFont("Single Day", "handwriting"),
  googleFont("Black And White Picture", "display"),
  googleFont("Orbit", "display"),
  googleFont("Grandiflora One", "serif"),
  googleFont("Diphylleia", "serif"),
];

const GOOGLE_LATIN_FONTS: FontOption[] = [
  googleFont("Bebas Neue", "display", false),
  googleFont("Playfair Display", "serif", false),
  googleFont("DM Serif Display", "serif", false),
  googleFont("Cormorant Garamond", "serif", false),
  googleFont("Oswald", "gothic", false),
  googleFont("Montserrat", "gothic", false),
  googleFont("Lora", "serif", false),
  googleFont("Pacifico", "handwriting", false),
  googleFont("Permanent Marker", "handwriting", false),
  googleFont("Righteous", "display", false),
  googleFont("Bungee", "display", false),
  googleFont("Archivo Black", "display", false),
  googleFont("Anton", "display", false),
  googleFont("Abril Fatface", "display", false),
  googleFont("Caveat", "handwriting", false),
];

interface NoonnuFontOptions {
  id: string;
  name: string;
  family: string;
  category: FontCategory;
  sourceUrl: string;
  pageId: number;
  popularityRank: number;
  aliases?: string[];
}

function noonnuFont(options: NoonnuFontOptions): FontOption {
  return {
    id: `noonnu-${options.id}`,
    name: options.name,
    family: `WM ${options.family}`,
    provider: "noonnu",
    category: options.category,
    supportsKorean: true,
    sourceUrl: options.sourceUrl,
    licenseUrl: `https://noonnu.cc/font_page/${options.pageId}`,
    popularityRank: options.popularityRank,
    aliases: options.aliases,
  };
}

// 2026-08-11 눈누 공식 인기순(order_by=pd) 상위 70위 중
// 상세 페이지가 직접 웹폰트 URL을 제공하는 항목만 포함합니다.
const NOONNU_FONTS: FontOption[] = [
  noonnuFont({
    id: "pretendard",
    name: "프리텐다드",
    family: "Pretendard",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Regular.woff2",
    pageId: 694,
    popularityRank: 1,
    aliases: ["Pretendard"],
  }),
  noonnuFont({
    id: "paperlogy",
    name: "페이퍼로지",
    family: "Paperlogy",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2",
    pageId: 1456,
    popularityRank: 2,
    aliases: ["Paperlogy"],
  }),
  noonnuFont({
    id: "gmarket-sans",
    name: "G마켓 산스",
    family: "Gmarket Sans",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff",
    pageId: 366,
    popularityRank: 3,
    aliases: ["Gmarket Sans", "지마켓 산스"],
  }),
  noonnuFont({
    id: "griun-fromsol",
    name: "그리운 프롬솔",
    family: "Griun Fromsol",
    category: "handwriting",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607161334@griun-fromsol-rg/griun-fromsol-rg/Griun_Fromsol-Rg.woff2",
    pageId: 1886,
    popularityRank: 5,
  }),
  noonnuFont({
    id: "jalnan",
    name: "여기어때 잘난체",
    family: "Jalnan",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff",
    pageId: 115,
    popularityRank: 6,
    aliases: ["Jalnan"],
  }),
  noonnuFont({
    id: "s-core-dream",
    name: "에스코어드림",
    family: "S-Core Dream",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-4Regular.woff",
    pageId: 223,
    popularityRank: 7,
    aliases: ["S-Core Dream", "에스코어 드림"],
  }),
  noonnuFont({
    id: "suit",
    name: "수트",
    family: "SUIT",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Regular.woff2",
    pageId: 845,
    popularityRank: 8,
    aliases: ["SUIT"],
  }),
  noonnuFont({
    id: "chosun-gu",
    name: "조선굴림체",
    family: "Chosun Gu",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGu.woff",
    pageId: 415,
    popularityRank: 10,
  }),
  noonnuFont({
    id: "ownglyph-park-dahyun",
    name: "온글잎 박다현체",
    family: "Ownglyph Park DaHyun",
    category: "handwriting",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2411-3@1.0/Ownglyph_ParkDaHyun.woff2",
    pageId: 1541,
    popularityRank: 11,
  }),
  noonnuFont({
    id: "sb-aggro",
    name: "어그로체",
    family: "SB Aggro",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/SBAggroB.woff",
    pageId: 738,
    popularityRank: 12,
    aliases: ["SBAggro"],
  }),
  noonnuFont({
    id: "bookk-myungjo",
    name: "부크크 명조",
    family: "Bookk Myungjo",
    category: "serif",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/BookkMyungjo-Bd.woff2",
    pageId: 1084,
    popularityRank: 15,
  }),
  noonnuFont({
    id: "freesentation",
    name: "프리젠테이션",
    family: "Freesentation",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2404@1.0/Freesentation-4Regular.woff2",
    pageId: 1369,
    popularityRank: 16,
    aliases: ["Freesentation"],
  }),
  noonnuFont({
    id: "hikr",
    name: "하이커체",
    family: "HiKR",
    category: "display",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607101609@hikr-extrabold/hikr-extrabold/HiKR-ExtraBold.woff2",
    pageId: 1865,
    popularityRank: 18,
    aliases: ["HiKR"],
  }),
  noonnuFont({
    id: "maru-buri",
    name: "마루 부리",
    family: "Maru Buri",
    category: "serif",
    sourceUrl:
      "https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-Regular.woff2",
    pageId: 487,
    popularityRank: 20,
  }),
  noonnuFont({
    id: "cafe24-ssurround",
    name: "카페24 써라운드",
    family: "Cafe24 Ssurround",
    category: "display",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/Cafe24Ssurround.woff",
    pageId: 669,
    popularityRank: 21,
  }),
  noonnuFont({
    id: "lee-seoyun",
    name: "이서윤체",
    family: "Lee Seoyun",
    category: "handwriting",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2202-2@1.0/LeeSeoyun.woff",
    pageId: 872,
    popularityRank: 24,
  }),
  noonnuFont({
    id: "bm-kkubulim",
    name: "꾸불림체",
    family: "BM Kkubulim",
    category: "handwriting",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/BMkkubulimTTF-Regular.woff2",
    pageId: 1500,
    popularityRank: 25,
  }),
  noonnuFont({
    id: "griun-hangeul-ochungi",
    name: "그리운 국한박 오춘기 김작가",
    family: "Griun Hangeul OCHUNGI",
    category: "handwriting",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607161334@griunxhangeulochungikim-regular/griunxhangeulochungikim-regular/GriunXHangeulOCHUNGIKIM-Regular.woff2",
    pageId: 1893,
    popularityRank: 26,
  }),
  noonnuFont({
    id: "kmu-sungkok-serif",
    name: "국민대학교 성곡 세리프",
    family: "KMU Sungkok Serif",
    category: "serif",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607101542@kmu80sungkokserif/kmu80sungkokserif/KMU80SungkokSerif.woff2",
    pageId: 1863,
    popularityRank: 27,
  }),
  noonnuFont({
    id: "gfc-gunhami-talks",
    name: "군함이말문트였체",
    family: "GFC Gunhami Talks",
    category: "display",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607131613@gfcgunhamitalks/gfcgunhamitalks/GFCGunhamiTalks.woff2",
    pageId: 1869,
    popularityRank: 29,
  }),
  noonnuFont({
    id: "a2z",
    name: "에이투지체",
    family: "A2Z",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-1Thin.woff2",
    pageId: 1778,
    popularityRank: 31,
    aliases: ["A2Z"],
  }),
  noonnuFont({
    id: "chosun-gs",
    name: "조선궁서체",
    family: "Chosun Gs",
    category: "serif",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff",
    pageId: 416,
    popularityRank: 32,
  }),
  noonnuFont({
    id: "ok-dandan",
    name: "Ok단단체",
    family: "Ok DanDan",
    category: "display",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2508-2@1.0/OkDanDan-Bold.woff2",
    pageId: 1664,
    popularityRank: 33,
  }),
  noonnuFont({
    id: "yuhan-kimberly-forest",
    name: "유한킴벌리 푸른숲체",
    family: "Yuhan Kimberly Forest",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607101517@font-2/font-2/font-2-300.woff2",
    pageId: 1859,
    popularityRank: 36,
  }),
  noonnuFont({
    id: "bm-jua",
    name: "주아체",
    family: "BM Jua",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/BMJUA.woff",
    pageId: 53,
    popularityRank: 37,
  }),
  noonnuFont({
    id: "gong-gothic",
    name: "이사만루",
    family: "Gong Gothic",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothicLight.woff",
    pageId: 463,
    popularityRank: 38,
  }),
  noonnuFont({
    id: "chosunilbo-myungjo",
    name: "조선일보명조체",
    family: "Chosunilbo Myungjo",
    category: "serif",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff",
    pageId: 63,
    popularityRank: 39,
  }),
  noonnuFont({
    id: "jayeon-sans",
    name: "자연산스",
    family: "Jayeon Sans",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/2607201621@jayeonsans-medium/jayeonsans-medium/JayeonSans-Regular.woff2",
    pageId: 1900,
    popularityRank: 40,
  }),
  noonnuFont({
    id: "ownglyph-uiyeun",
    name: "온글잎 의연체",
    family: "Ownglyph Uiyeun",
    category: "handwriting",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105@1.1/Uiyeun.woff",
    pageId: 667,
    popularityRank: 41,
  }),
  noonnuFont({
    id: "one-mobile-pop",
    name: "원스토어 모바일POP체",
    family: "ONE Mobile POP",
    category: "display",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-POP.woff",
    pageId: 676,
    popularityRank: 42,
  }),
  noonnuFont({
    id: "ridi-batang",
    name: "리디바탕",
    family: "RIDI Batang",
    category: "serif",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/RIDIBatang.woff",
    pageId: 324,
    popularityRank: 45,
  }),
  noonnuFont({
    id: "nanum-square-neo",
    name: "나눔스퀘어 네오",
    family: "Nanum Square Neo",
    category: "gothic",
    sourceUrl:
      "https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-aLt.woff2",
    pageId: 1053,
    popularityRank: 46,
  }),
  noonnuFont({
    id: "ownglyph-corncorn",
    name: "온글잎 콘콘체",
    family: "Ownglyph Corncorn",
    category: "handwriting",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2412-1@1.0/Ownglyph_corncorn-Rg.woff2",
    pageId: 1546,
    popularityRank: 47,
  }),
  noonnuFont({
    id: "ria-sans",
    name: "리아체",
    family: "Ria Sans",
    category: "display",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/RiaSans-ExtraBold.woff2",
    pageId: 1510,
    popularityRank: 48,
  }),
  noonnuFont({
    id: "keris-kedu",
    name: "케리스 케듀체",
    family: "KERIS KEDU",
    category: "display",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2601-3@1.0/KERISKEDU_R.woff2",
    pageId: 1756,
    popularityRank: 49,
  }),
  noonnuFont({
    id: "gowun-batang",
    name: "고운바탕",
    family: "Gowun Batang Noonnu",
    category: "serif",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff",
    pageId: 733,
    popularityRank: 50,
  }),
  noonnuFont({
    id: "hs-summer",
    name: "HS여름물빛체",
    family: "HS Summer",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/HSSummer.woff",
    pageId: 46,
    popularityRank: 51,
  }),
  noonnuFont({
    id: "gangwon-edu",
    name: "강원교육모두체",
    family: "Gangwon Edu",
    category: "serif",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEdu_OTFLightA.woff",
    pageId: 802,
    popularityRank: 52,
  }),
  noonnuFont({
    id: "grace-serif",
    name: "우아한 세리프",
    family: "Grace Serif",
    category: "serif",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2604-1@1.0/GraceSerif-Regular.woff2",
    pageId: 1800,
    popularityRank: 54,
  }),
  noonnuFont({
    id: "pyeongchang-peace",
    name: "평창평화체",
    family: "PyeongChang Peace",
    category: "display",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-02@1.0/PyeongChangPeace-Light.woff2",
    pageId: 950,
    popularityRank: 55,
  }),
  noonnuFont({
    id: "cookie-run",
    name: "쿠키런",
    family: "CookieRun",
    category: "display",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/CookieRun-Regular.woff",
    pageId: 364,
    popularityRank: 56,
  }),
  noonnuFont({
    id: "dunggeunmo",
    name: "둥근모꼴+ Fixedsys",
    family: "DungGeunMo",
    category: "monospace",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff",
    pageId: 250,
    popularityRank: 57,
    aliases: ["Fixedsys", "둥근모꼴"],
  }),
  noonnuFont({
    id: "maplestory",
    name: "넥슨 메이플스토리",
    family: "Maplestory",
    category: "display",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/MaplestoryOTFLight.woff",
    pageId: 427,
    popularityRank: 59,
  }),
  noonnuFont({
    id: "seoul-alrim",
    name: "서울알림체",
    family: "Seoul Alrim",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2505-1@1.0/SeoulAlrimTTF-Medium.woff2",
    pageId: 1604,
    popularityRank: 60,
  }),
  noonnuFont({
    id: "cafe24-anemone",
    name: "카페24 아네모네",
    family: "Cafe24 Anemone",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/Cafe24Ohsquare.woff",
    pageId: 363,
    popularityRank: 61,
  }),
  noonnuFont({
    id: "jalnan-gothic",
    name: "여기어때 잘난체 고딕",
    family: "Jalnan Gothic",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_231029@1.1/JalnanGothic.woff",
    pageId: 1254,
    popularityRank: 64,
  }),
  noonnuFont({
    id: "nanum-square-round",
    name: "나눔스퀘어라운드",
    family: "Nanum Square Round",
    category: "gothic",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/NanumSquareRound.woff",
    pageId: 38,
    popularityRank: 65,
  }),
  noonnuFont({
    id: "griun-police-sensibility",
    name: "그리운 경찰감성체",
    family: "Griun Police Sensibility",
    category: "handwriting",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/Griun_PolSensibility-Rg.woff2",
    pageId: 1777,
    popularityRank: 68,
  }),
  noonnuFont({
    id: "d2coding",
    name: "D2Coding",
    family: "D2Coding",
    category: "monospace",
    sourceUrl:
      "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_three@1.0/D2Coding.woff",
    pageId: 92,
    popularityRank: 70,
    aliases: ["D2 코딩"],
  }),
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
  ...GOOGLE_KOREAN_POPULAR_FONTS,
  ...GOOGLE_KOREAN_EXTRA_FONTS,
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
