// 인생네컷 설정 파일 — 행사 전에 여기만 고치면 됩니다.
window.BOOTH_CONFIG = {
  // Google Apps Script 웹 앱 주소 (README의 "QR 다운로드 설정" 참고).
  // 비워 두면 QR 없이 이 기기에만 저장됩니다.
  uploadUrl: "",

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

  countdown: 5,       // 한 컷당 카운트다운 (초)
  mirror: true,       // 셀카처럼 좌우 반전
  jpegQuality: 0.9,
};
