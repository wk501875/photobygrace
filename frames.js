// Here by Grace 프레임 디자인 5종 — 디자인 시안(400×1200)을 그대로 캔버스로 옮긴 것.
// 결과 사진은 3배(1200×3600)로 그려요. 좌표는 시안 단위(px)로 적고 그릴 때 늘립니다.
// 각 디자인: name, slots(사진 칸: x, y, w, h, r 모서리, rot 회전도), empty(빈 칸 색), fonts(미리 불러올 글꼴), bg(배경), fg(사진 위 장식·글자)
(() => {
  const U = { w: 400, h: 1200 };
  const RAINBOW_SOFT = ["#F4A7A0", "#F8C79B", "#F6E3A1", "#B9D8B4", "#A9CDE8", "#AFB4E0", "#CDB4DB"];

  // 글자: 정렬, 자간(em), 세로 가운데 맞춤
  function text(ctx, s, x, y, { font, color, align = "left", ls = 0, stroke, strokeW = 0 }) {
    ctx.save();
    ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = "middle";
    const size = parseFloat(String(font).match(/(\d+(\.\d+)?)px/)[1]);
    const gap = ls * size;
    if (!gap) {
      ctx.textAlign = align;
      if (stroke) { ctx.lineJoin = "round"; ctx.strokeStyle = stroke; ctx.lineWidth = strokeW; ctx.fillText(s, x, y); ctx.strokeText(s, x, y); }
      else ctx.fillText(s, x, y);
      ctx.restore(); return;
    }
    // 자간: 한 글자씩
    ctx.textAlign = "left";
    const chars = [...s], widths = chars.map(c => ctx.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1);
    let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
    chars.forEach((c, i) => { ctx.fillText(c, cx, y); cx += widths[i] + gap; });
    ctx.restore();
  }
  const textWidth = (ctx, s, font, ls = 0) => { ctx.save(); ctx.font = font; const size = parseFloat(font.match(/(\d+(\.\d+)?)px/)[1]); const w = ctx.measureText(s).width + ls * size * Math.max(0, [...s].length - 1); ctx.restore(); return w; };
  function rrect(ctx, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  // 무지개 반원 (SVG 시안의 path를 그대로): center(cx, cy) 기준 반지름 목록
  function arcs(ctx, ox, oy, scale, cx, cy, radii, colors, width) {
    ctx.save(); ctx.lineCap = "round"; ctx.lineWidth = width * scale;
    radii.forEach((r, i) => { ctx.strokeStyle = colors[i]; ctx.beginPath(); ctx.arc(ox + cx * scale, oy + cy * scale, r * scale, Math.PI, 2 * Math.PI); ctx.stroke(); });
    ctx.restore();
  }
  const PIN = "M7 17s5-5.2 5-9.5A5 5 0 0 0 2 7.5C2 11.8 7 17 7 17z";
  function pin(ctx, x, y, s, color, w) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = color; ctx.lineWidth = w / s; ctx.fillStyle = "none";
    ctx.stroke(new Path2D(PIN)); ctx.beginPath(); ctx.arc(7, 7.5, 1.8, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  function foot(ctx, x, y, color) {   // 시안 B의 발자국 (10×16)
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(5, 10, 4, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    for (const [cx, cy, r] of [[2.5, 2.5, 1.4], [5.5, 1.6, 1.4], [8.2, 3, 1.2]]) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  const SPARK = new Path2D("M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z");
  function spark(ctx, x, y, size, color) { ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24); ctx.fillStyle = color; ctx.fill(SPARK); ctx.restore(); }

  const D = {};

  // A. 파스텔 무지개
  D.pastel = {
    name: "파스텔 무지개", empty: "#E9E2D6",
    fonts: ["700 44px Caveat", "13px 'Gowun Dodum'"],
    slots: [162, 392, 622, 852].map(y => ({ x: 22, y, w: 356, h: 216, r: 14 })),
    bg(ctx) { ctx.fillStyle = "#FAF6EF"; ctx.fillRect(0, 0, U.w, U.h); },
    fg(ctx) {
      const sc = 72 / 86;   // 170×72 박스에 viewBox 170×86
      arcs(ctx, 115 + (170 - 170 * sc) / 2, 46, sc, 85, 84, [77, 70, 63, 56, 49, 42, 35], RAINBOW_SOFT, 5);
      text(ctx, "Here by Grace", 200, 129, { font: "700 44px Caveat, cursive", color: "#4A3F35", align: "center" });
      RAINBOW_SOFT.forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(147 + 5 + i * 16, 1132, 5, 0, Math.PI * 2); ctx.fill(); });
      text(ctx, "여호와께서 여기까지 우리를 도우셨다", 200, 1150, { font: "13px 'Gowun Dodum', sans-serif", color: "#4A3F35", align: "center", ls: .02 });
      text(ctx, "2026 성도교제의 밤 · 삼상 7:12", 200, 1171, { font: "11px 'Gowun Dodum', sans-serif", color: "#6E6152", align: "center" });
    },
  };

  // B. 화이트 미니멀
  D.minimal = {
    name: "화이트 미니멀", empty: "#F1F1F1",
    fonts: ["italic 500 36px Fraunces", "500 11px 'Noto Sans KR'", "10px 'Noto Sans KR'"],
    slots: [134, 366, 598, 830].map(y => ({ x: 24, y, w: 352, h: 222, r: 0 })),
    bg(ctx) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, U.w, U.h); },
    fg(ctx) {
      text(ctx, "Here by", 24, 49, { font: "italic 500 36px Fraunces, Georgia, serif", color: "#222222", ls: -.01 });
      text(ctx, "Grace.", 24, 85, { font: "italic 500 36px Fraunces, Georgia, serif", color: "#222222", ls: -.01 });
      text(ctx, "2026.12", 376, 80, { font: "10px 'Noto Sans KR', sans-serif", color: "#555555", align: "right" });
      text(ctx, "성도교제의 밤", 376, 95, { font: "10px 'Noto Sans KR', sans-serif", color: "#555555", align: "right" });
      const g = ctx.createLinearGradient(24, 0, 376, 0); RAINBOW_SOFT.forEach((c, i) => g.addColorStop(i / 6, c));
      ctx.fillStyle = g; rrect(ctx, 24, 116, 352, 4, 2); ctx.fill();
      ["#F4A7A0", "#F6E3A1", "#B9D8B4", "#A9CDE8", "#CDB4DB"].forEach((c, i) => foot(ctx, 24 + i * 18, i % 2 ? 1162 : 1158, c));
      pin(ctx, 114, 1157, 1, "#222222", 1.6);
      text(ctx, "HERE · 삼상 7:12", 376, 1166, { font: "500 11px 'Noto Sans KR', sans-serif", color: "#222222", align: "right", ls: .18 });
    },
  };

  // C. 은혜 여권 스크랩북 (사진 카드가 살짝 기울고 마스킹테이프)
  const PASS_Y = [124, 348, 572, 796], PASS_ROT = [-1.2, 1, -.8, 1.3];
  const PASS_TAPE = [[137.6, -4, "rgba(244,167,160,.75)"], [41.3, 5, "rgba(246,227,161,.85)"], [225.8, -3, "rgba(185,216,180,.85)"], [158.2, 4, "rgba(205,180,219,.85)"]];
  D.passport = {
    name: "은혜 여권", empty: "#DCD3C2",
    fonts: ["700 32px Gaegu", "700 10px 'Space Mono'", "10px 'Space Mono'"],
    slots: PASS_Y.map((y, i) => ({ x: 36, y: y + 8, w: 328, h: 192, r: 0, rot: PASS_ROT[i] })),
    bg(ctx) {
      ctx.fillStyle = "#EFE4CF"; ctx.fillRect(0, 0, U.w, U.h);
      // 사진 카드(흰 테두리 + 그림자): 사진보다 먼저
      PASS_Y.forEach((y, i) => {
        ctx.save(); ctx.translate(200, y + 104); ctx.rotate(PASS_ROT[i] * Math.PI / 180);
        ctx.shadowColor = "rgba(51,50,94,.18)"; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-172, -104, 344, 208); ctx.restore();
      });
    },
    fg(ctx) {
      ctx.save(); ctx.setLineDash([6, 4]); ctx.lineWidth = 2; ctx.strokeStyle = "#33325E"; rrect(ctx, 23, 21, 354, 87.6, 10); ctx.stroke(); ctx.restore();
      text(ctx, "GRACE PASSPORT", 36, 37, { font: "700 10px 'Space Mono', monospace", color: "#33325E", ls: .2 });
      text(ctx, "Here by Grace", 36, 62, { font: "700 32px Gaegu, cursive", color: "#33325E" });
      text(ctx, "No. 2026 · 성도교제의 밤", 36, 87, { font: "10px 'Space Mono', monospace", color: "#33325E" });
      ctx.save(); ctx.translate(331, 64.8); ctx.rotate(-12 * Math.PI / 180);
      ctx.strokeStyle = "#E4877E"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.stroke();
      ["ARRIVED", "BY", "GRACE"].forEach((t, i) => text(ctx, t, 0, (i - 1) * 11.7, { font: "700 9px 'Space Mono', monospace", color: "#E4877E", align: "center" }));
      ctx.restore();
      PASS_Y.forEach((y, i) => {   // 테이프
        const [tx, rot, col] = PASS_TAPE[i];
        ctx.save(); ctx.translate(200, y + 104); ctx.rotate(PASS_ROT[i] * Math.PI / 180);
        ctx.translate(-172 + tx + 35, -104); ctx.rotate(rot * Math.PI / 180); ctx.fillStyle = col; ctx.fillRect(-35, -9, 70, 18); ctx.restore();
      });
      ["#E4877E", "#E9A86E", "#D9B94E", "#7FB07A", "#6FA3CF", "#7C82C8", "#A887BF"].forEach((c, i) => {
        ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(22 + 17 + i * (34 + 19.67), 1132.5, 16, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.save(); ctx.setLineDash([5, 3]); ctx.lineWidth = 1.5; ctx.strokeStyle = "#33325E"; ctx.beginPath(); ctx.moveTo(22, 1158); ctx.lineTo(378, 1158); ctx.stroke(); ctx.restore();
      const f = "10px 'Space Mono', monospace";
      text(ctx, "FROM: 은혜", 22, 1172, { font: f, color: "#33325E" });
      text(ctx, "TO: HERE", 200, 1172, { font: f, color: "#33325E", align: "center" });
      text(ctx, "삼상 7:12", 378, 1172, { font: f, color: "#33325E", align: "right" });
    },
  };

  // D. 성도교제의 밤 (다크)
  const NIGHT_BORDER = ["#FF9E94", "#FFE69A", "#9CD3FF", "#E2B6FF"];
  D.night = {
    name: "성도교제의 밤", empty: "#222A4A",
    fonts: ["italic 40px 'DM Serif Display'", "700 14px 'Gowun Batang'", "11px 'Gowun Batang'"],
    slots: [164, 394, 624, 854].map(y => ({ x: 22, y, w: 356, h: 218, r: 18 })),
    bg(ctx) {
      ctx.fillStyle = "#141A33"; ctx.fillRect(0, 0, U.w, U.h);
      for (const [x, y, s, c] of [[40, 30, 3, "#F6E3A1"], [330, 70, 2, "#FFFFFF"], [250, 18, 2, "#FFFFFF"], [24, 110, 2, "#A9CDE8"], [360, 1150, 3, "#F6E3A1"]]) {
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2); ctx.fill();
      }
    },
    fg(ctx) {
      const sc = 62 / 76;
      ctx.save(); ctx.shadowColor = "rgba(205,180,219,.6)"; ctx.shadowBlur = 6;
      arcs(ctx, 125 + (150 - 150 * sc) / 2, 44, sc, 75, 74, [69, 61, 53, 45, 37, 29, 21], ["#FF9E94", "#FFC28A", "#FFE69A", "#A8E6A3", "#9CD3FF", "#A7AEFF", "#E2B6FF"], 2.5);
      ctx.restore();
      text(ctx, "Here by Grace", 200, 130, { font: "italic 40px 'DM Serif Display', Georgia, serif", color: "#F3EEDF", align: "center" });
      this.slots.forEach((s, i) => { ctx.strokeStyle = NIGHT_BORDER[i]; ctx.lineWidth = 1.5; rrect(ctx, s.x + .75, s.y + .75, s.w - 1.5, s.h - 1.5, s.r - .75); ctx.stroke(); });
      text(ctx, "은혜로 여기까지", 200, 1150, { font: "700 14px 'Gowun Batang', serif", color: "#F3EEDF", align: "center" });
      text(ctx, "2026 성도교제의 밤 · 창 9:13", 200, 1172, { font: "11px 'Gowun Batang', serif", color: "#B9BDD3", align: "center", ls: .08 });
    },
  };

  // E. 홀로그램 Y2K
  D.holo = {
    name: "홀로그램", empty: "rgba(255,255,255,.55)",
    fonts: ["46px 'Bagel Fat One'", "700 11px 'Noto Sans KR'", "500 11px 'Noto Sans KR'"],
    slots: [158, 392, 626, 860].map(y => ({ x: 25, y: y + 5, w: 350, h: 212, r: 19 })),
    bg(ctx) {
      const a = 160 * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), len = Math.abs(U.w * dx) + Math.abs(U.h * dy);
      const g = ctx.createLinearGradient(200 - dx * len / 2, 600 - dy * len / 2, 200 + dx * len / 2, 600 + dy * len / 2);
      [["#FDE2EC", 0], ["#FFF3D6", .22], ["#DDF5E6", .45], ["#DCEBFF", .68], ["#EADFFF", 1]].forEach(([c, p]) => g.addColorStop(p, c));
      ctx.fillStyle = g; ctx.fillRect(0, 0, U.w, U.h);
    },
    fg(ctx) {
      const bf = "700 11px 'Noto Sans KR', sans-serif", bw = textWidth(ctx, "2026 성도교제의 밤", bf, .2) + 24;
      const total = 18 + 8 + bw + 8 + 14, x0 = 200 - total / 2;
      spark(ctx, x0, 49, 18, "#FFFFFF");
      ctx.fillStyle = "#3A2F6B"; rrect(ctx, x0 + 26, 46, bw, 24, 12); ctx.fill();
      text(ctx, "2026 성도교제의 밤", x0 + 26 + bw / 2, 58, { font: bf, color: "#FFFFFF", align: "center", ls: .2 });
      spark(ctx, x0 + 26 + bw + 8, 51, 14, "#FFFFFF");
      text(ctx, "Here by Grace", 200, 99, { font: "46px 'Bagel Fat One', sans-serif", color: "#FFFFFF", align: "center", stroke: "#3A2F6B", strokeW: 2 });
      this.slots.forEach(s => { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5; rrect(ctx, s.x - 2.5, s.y - 2.5, s.w + 5, s.h + 5, 21.5); ctx.stroke(); });
      const pf = "700 12px 'Noto Sans KR', sans-serif", pw = 12 + 12 + 6 + textWidth(ctx, "HERE", pf) + 12;
      ctx.fillStyle = "#FFFFFF"; rrect(ctx, 20, 1151, pw, 29, 14.5); ctx.fill();
      pin(ctx, 32, 1158, 12 / 14, "#3A2F6B", 2);
      text(ctx, "HERE", 50, 1166, { font: pf, color: "#3A2F6B" });
      text(ctx, "은혜로 여기까지 · 삼상 7:12", 380, 1166, { font: "500 11px 'Noto Sans KR', sans-serif", color: "#3A2F6B", align: "right" });
    },
  };

  // 바깥에서 쓰는 모양: 사진 칸은 결과 크기(1200×3600) 픽셀로
  const K = 3;
  window.FRAME_DESIGNS = Object.fromEntries(Object.entries(D).map(([k, d]) => [k, {
    name: d.name, w: U.w * K, h: U.h * K, empty: d.empty, fonts: d.fonts,
    slots: d.slots.map(s => ({ x: s.x * K, y: s.y * K, w: s.w * K, h: s.h * K, r: (s.r || 0) * K, rot: s.rot || 0 })),
    draw(ctx, layer) { ctx.save(); ctx.scale(K, K); d[layer].call(d, ctx); ctx.restore(); },
  }]));
})();
