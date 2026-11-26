// 인생네컷 설정 파일 — 행사 전에 여기만 고치면 됩니다.
window.BOOTH_CONFIG = {
  // 사진 업로드 주소. 기본값은 Cloudflare R2 (functions/api/upload.js).
  // 구글 드라이브로 바꾸려면 Apps Script 웹 앱 주소(https://script.google.com/.../exec)를 넣으세요.
  // 행사 코드는 여기 적지 말고, 촬영 노트북의 "설정 → 행사 코드"에 입력합니다.
  uploadUrl: "/api/upload",

  // 프레임 하단에 들어갈 글자 (frameImage를 쓰면 무시됩니다)
  title: "Here by Grace",
  subtitle: "성도교제의 밤",
  footer: "2026. 12",

  // 디자인한 프레임 PNG (1200 x 3600, 사진 칸은 투명). 예: "frames/frame.png"
  // 비워 두면 기본 흰색 프레임을 그립니다.
  frameImage: "",

  // 사진 칸 위치 (1200 x 3600 기준 픽셀). 프레임 PNG를 만들 때 이 칸에 맞춰 투명하게 비워 주세요.
  slots: [
    { x: 80, y: 80,   w: 1040, h: 694 },
    { x: 80, y: 814,  w: 1040, h: 694 },
    { x: 80, y: 1548, w: 1040, h: 694 },
    { x: 80, y: 2282, w: 1040, h: 694 },
  ],

  // 컷마다 화면에 보여 줄 포즈 안내
  poses: ["활짝 웃어요", "손가락 하트", "브이!", "자유 포즈"],

  // 결과 화면에서 아무것도 안 누르면 처음 화면으로 돌아가는 시간 (초). 0이면 안 돌아감
  idleReset: 90,

  countdown: 5,       // 한 컷당 카운트다운 (초)
  mirror: true,       // 셀카처럼 좌우 반전
  jpegQuality: 0.9,
};
