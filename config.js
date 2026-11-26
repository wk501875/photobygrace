// Here by Grace 포토부스 설정 — 행사 전에 여기만 고치면 됩니다.
window.BOOTH_CONFIG = {
  // 사진 업로드 주소. 기본값은 Cloudflare R2 (functions/api/upload.js).
  // 행사 코드는 여기 적지 말고, 촬영 태블릿의 "운영 설정 → 행사 코드"에 입력합니다.
  uploadUrl: "/api/upload",

  // 시작 화면과 사진 프레임에 들어가는 글자
  title: "Here by Grace",            // 가운데 단어(by)는 기울임 골드로 표시돼요
  event: "2026 성도교제의 밤",       // 시작 화면 배지, 프레임 위쪽
  verse: { text: "나의 나 된 것은 다 하나님의 은혜로 된 것이니", ref: "고린도전서 15:10" },
  date: "",                          // 프레임 오른쪽 아래 날짜. 비워 두면 찍은 날짜 (예: 2026. 11. 28)

  // 사진 모양: 결과 화면에서 바꿀 수 있어요. 사진 칸은 모두 4:3이라 다시 찍지 않고 바꿀 수 있어요.
  // w, h: 결과 사진 크기(px) / slots: 사진 칸 [x, y, 가로, 세로]
  layout: "strip",
  layouts: {
    strip:    { name: "세로형", w: 1200, h: 3600, slots: [[120, 150, 960, 720], [120, 898, 960, 720], [120, 1646, 960, 720], [120, 2394, 960, 720]] },
    postcard: { name: "엽서형", w: 2400, h: 2340, slots: [[120, 210, 1050, 788], [1230, 210, 1050, 788], [120, 1058, 1050, 788], [1230, 1058, 1050, 788]] },
  },
  // 사진 모양별 디자인 프레임 PNG (위 w×h 크기, 사진 칸은 투명). 비워 두면 기본 프레임을 그려요.
  frameImages: { strip: "", postcard: "" },

  // 프레임 색 (결과 화면에서 고르기): cream, olive, terracotta, black
  frame: "cream",
  // 필터 (결과 화면에서 고르기): none 원본, soft 뽀샤시, mono 흑백, film 필름, grace 따뜻한 빛
  look: "grace",

  // 여러 장 찍고 고르기: 4장보다 extraShots장 더 찍고 4장을 골라요. 끄려면 pickMore: false
  pickMore: true,
  extraShots: 2,

  // 컷마다 화면에 보여 줄 포즈 안내 (찍는 장수보다 적으면 반복)
  poses: ["활짝 웃어요", "손가락 하트", "브이!", "서로 기대 보기", "자유 포즈", "마지막 한 장!"],

  countdown: 3,       // 한 컷당 카운트다운 (초)
  mirror: true,       // 셀카처럼 좌우 반전
  idleReset: 90,      // 결과 화면에서 아무것도 안 누르면 처음으로 돌아가는 시간 (초)
  jpegQuality: 0.9,

  // 결과 사진에 붙이는 스티커 (결과 화면에서 눌러 추가 → 사진 위에서 끌어 옮기기)
  // size: 사진 크기 대비 크기. 그림은 stickers 폴더의 투명 이미지
  stickers: [
    { id: "stone-here-by-grace", name: "에벤에셀 비석", size: .62, at: [.8, .64] },
    { id: "stone-tower",         name: "에벤에셀 돌탑", size: .7,  at: [.84, .6] },
    { id: "stone-tree",          name: "나무와 비석",   size: .6,  at: [.8, .66] },
    { id: "stone-tree-2",        name: "나무와 비석 2", size: .6,  at: [.8, .66] },
    { id: "stone-candles",       name: "촛불 돌",       size: .38, at: [.74, .78] },
    { id: "stone-candle-small",  name: "작은 촛불 돌",  size: .3,  at: [.2, .8] },
    { id: "light-cloud",         name: "빛 구름",       size: .3,  at: [.25, .18] },
    { id: "night-sky",           name: "밤하늘",        size: .26, at: [.85, .2] },
    { id: "rainbow-big",         name: "무지개",        size: .36, at: [.2, .72] },
    { id: "rainbow-cloud",       name: "구름 무지개",   size: .28, at: [.8, .2] },
    { id: "rainbow",             name: "작은 무지개",   size: .2,  at: [.18, .2] },
    { id: "dove",                name: "비둘기",        size: .24, at: [.84, .2] },
    { id: "wreath",              name: "Grace 리스",    size: .28, at: [.18, .22] },
    { id: "wax-seal",            name: "Grace 씰",      size: .22, at: [.85, .2] },
    { id: "grace-book",          name: "Grace 우표",    size: .22, at: [.15, .2] },
    { id: "ribbon",              name: "리본",          size: .16, at: [.5, .12] },
    { id: "script-here-by-grace", name: "here by grace", size: .16, at: [.5, .12] },
    { id: "script-by-his-grace", name: "by His grace",  size: .14, at: [.5, .88] },
    { id: "text-here-by-grace",  name: "HERE BY GRACE", size: .2,  at: [.2, .15] },
    { id: "text-all-grace",      name: "모든 것이 은혜", size: .24, at: [.18, .2] },
    { id: "text-only-grace",     name: "오직 은혜",     size: .26, at: [.15, .22] },
    { id: "text-grace",          name: "은혜",          size: .18, at: [.15, .15] },
    { id: "heart",               name: "하트",          size: .12, at: [.88, .14] },
    { id: "heart-small",         name: "작은 하트",     size: .09, at: [.12, .12] },
    { id: "star",                name: "별",            size: .12, at: [.9, .12] },
    { id: "olive",               name: "올리브",        size: .22, at: [.1, .8] },
    { id: "wheat",               name: "밀 이삭",       size: .2,  at: [.9, .82] },
    { id: "leaf",                name: "잎사귀",        size: .14, at: [.1, .9] },
    { id: "sprout",              name: "새싹",          size: .12, at: [.9, .9] },
  ],
};
