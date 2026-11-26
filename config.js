// 인생네컷 설정 파일 — 행사 전에 여기만 고치면 됩니다.
window.BOOTH_CONFIG = {
  // 사진 업로드 주소. 기본값은 Cloudflare R2 (functions/api/upload.js).
  // 구글 드라이브로 바꾸려면 Apps Script 웹 앱 주소(https://script.google.com/.../exec)를 넣으세요.
  // 행사 코드는 여기 적지 말고, 촬영 노트북의 "설정 → 행사 코드"에 입력합니다.
  uploadUrl: "/api/upload",

  // 프레임에 들어갈 글자 (흰색·검정 디자인)
  title: "Here by Grace",
  subtitle: "성도교제의 밤",
  footer: "2026. 12",

  // 사진 모양 (촬영 전 "프레임 고르기"에서 바꿀 수 있어요). 처음 선택돼 있는 모양:
  layout: "strip4",

  // 사진 모양 목록. 빼고 싶은 건 지우면 화면에서도 사라져요.
  // w, h: 결과 사진 크기(px) / slots: 사진 칸 [x, y, 가로, 세로]. 칸 비율이 카메라 화면 비율이 돼요.
  // 첫 칸 위 여백(160 × u)과 마지막 칸 아래 여백(약 134 × u)에 디자인의 제목·말씀이 들어가요.
  layouts: {
    strip4: { name: "세로 4컷", w: 1200, h: 3600, slots: [[66, 480, 1068, 648], [66, 1170, 1068, 648], [66, 1860, 1068, 648], [66, 2550, 1068, 648]] },
    grid4:  { name: "2×2 4컷", w: 2400, h: 3600, slots: [[90, 600, 1084, 1223], [1226, 600, 1084, 1223], [90, 1875, 1084, 1223], [1226, 1875, 1084, 1223]] },
    big2:   { name: "큰 2컷",  w: 2400, h: 3600, slots: [[90, 600, 2220, 1223], [90, 1875, 2220, 1223]] },
    group1: { name: "단체 1컷", w: 3600, h: 2880, slots: [[66, 480, 3468, 1998]] },
  },

  // 디자인 (frames.js): 어떤 사진 모양에도 다 입힐 수 있어요. 이 순서로 나오고, 빼고 싶은 건 지우세요.
  // white 흰색, black 검정, pastel 파스텔 무지개, minimal 화이트 미니멀, passport 은혜 여권, night 성도교제의 밤, holo 홀로그램
  styles: ["white", "black", "pastel", "minimal", "passport", "night", "holo"],
  frame: "pastel",   // 처음 선택돼 있는 디자인

  // 홈 화면 배경 루프 영상 (소리 없이 반복). 빼려면 "" → 예전 흑백 홈 화면
  homeVideo: "media/home-loop.mp4",
  homePoster: "media/home-loop.jpg",

  // 컷마다 화면에 보여 줄 포즈 안내
  poses: ["활짝 웃어요", "손가락 하트", "브이!", "자유 포즈"],

  // 여러 장 찍고 고르기: 컷 수보다 extraShots장 더 찍고 마음에 드는 컷을 골라요 (세로 4컷이면 6장 중 4장)
  // 끄려면 pickMore: false (태블릿 설정에서도 바꿀 수 있어요)
  pickMore: true,
  extraShots: 2,

  // 결과 화면에서 아무것도 안 누르면 처음 화면으로 돌아가는 시간 (초). 0이면 안 돌아감
  idleReset: 90,

  countdown: 5,       // 한 컷당 카운트다운 (초)
  mirror: true,       // 셀카처럼 좌우 반전

  // 처음 선택돼 있는 필터 (촬영 화면에서 바꿀 수 있어요)
  // "none" 원본, "soft" 뽀샤시, "mono" 흑백, "film" 필름, "grace" 은혜의 빛
  look: "grace",

  // 사진에 붙이는 스티커 (촬영 화면에서 눌러 추가 → 카메라 화면에서 끌어서 옮기기)
  // size: 사진 높이 대비 크기, at: 처음 놓이는 위치 [가로, 세로] (0~1). 그림은 stickers 폴더의 투명 이미지
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

  // 사진 아래에 넣을 은혜 말씀 (사진마다 하나씩 랜덤, 개역한글)
  // 줄을 추가·삭제해서 자유롭게 바꿀 수 있어요. 길면 글자가 자동으로 작아져요. 빼려면 verse: false
  verse: true,
  verses: [
    { text: "나의 나 된 것은 하나님의 은혜로 된 것이니", ref: "고전 15:10" },
    { text: "여호와께서 여기까지 우리를 도우셨다", ref: "삼상 7:12" },
    { text: "내 은혜가 네게 족하도다", ref: "고후 12:9" },
    { text: "너희가 그 은혜를 인하여 믿음으로 말미암아 구원을 얻었나니", ref: "엡 2:8" },
    { text: "우리가 다 그의 충만한데서 받으니 은혜 위에 은혜러라", ref: "요 1:16" },
    { text: "은혜의 보좌 앞에 담대히 나아갈 것이니라", ref: "히 4:16" },
  ],
  jpegQuality: 0.9,
};
