// Here by Grace 프레임 디자인 — 어떤 사진 모양(세로 4컷, 2×2, 큰 2컷, 단체 1컷)에도 입힐 수 있게 그려요.
// 시안(400×1200) 단위로 적고, 그릴 때 사진 모양에 맞춰 늘립니다.
//   u      : 시안 1px이 실제 몇 px인지 (= 첫 사진 칸 위 여백 / 160)
//   위 장식 : 시안의 y 그대로 (첫 칸 위 여백 안)
//   아래 글 : 시안의 1100~1200 구간을 마지막 칸 아래 여백 가운데에
//   좌우   : 왼쪽 것은 사진 왼쪽 끝(L)에, 오른쪽 것은 오른쪽 끝(R)에, 가운데 것은 가운데에 맞춤
// 각 디자인: name, empty(빈 칸 색), fonts(미리 불러올 글꼴), photo(칸 → 사진 자리), draw(ctx, "bg" | "fg", G)
(() => {
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
    ctx.textAlign = "left";   // 자간: 한 글자씩
    const chars = [...s], widths = chars.map(c => ctx.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1);
    let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
    chars.forEach((c, i) => { ctx.fillText(c, cx, y); cx += widths[i] + gap; });
    ctx.restore();
  }
  const textWidth = (ctx, s, font, ls = 0) => { ctx.save(); ctx.font = font; const size = parseFloat(font.match(/(\d+(\.\d+)?)px/)[1]); const w = ctx.measureText(s).width + ls * size * Math.max(0, [...s].length - 1); ctx.restore(); return w; };
  // 폭 안에 들어가도록 글자 크기 줄이기
  function fitFont(ctx, s, size, make, room) { while (size > 6 && textWidth(ctx, s, make(size)) > room) size *= .95; return make(size); }
  function rrect(ctx, x, y, w, h, r) { r = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  // 무지개 반원: 가운데(cx, cy), 반지름 목록(px)
  function arcs(ctx, cx, cy, radii, colors, width) {
    ctx.save(); ctx.lineCap = "round"; ctx.lineWidth = width;
    radii.forEach((r, i) => { ctx.strokeStyle = colors[i]; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI); ctx.stroke(); });
    ctx.restore();
  }
  const PIN = "M7 17s5-5.2 5-9.5A5 5 0 0 0 2 7.5C2 11.8 7 17 7 17z";
  function pin(ctx, x, y, s, color, w) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = color; ctx.lineWidth = w / s;
    ctx.stroke(new Path2D(PIN)); ctx.beginPath(); ctx.arc(7, 7.5, 1.8, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  function foot(ctx, x, y, s, color) {   // 발자국 (10×16)
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(5, 10, 4, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    for (const [cx, cy, r] of [[2.5, 2.5, 1.4], [5.5, 1.6, 1.4], [8.2, 3, 1.2]]) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  const SPARK = new Path2D("M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z");
  function spark(ctx, x, y, size, color) { ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24); ctx.fillStyle = color; ctx.fill(SPARK); ctx.restore(); }
  const dot = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };

  // 시안 좌표 → 실제 좌표
  //   hy(y): 위 여백 (시안의 첫 칸 위치 top에 맞춰 가운데로), fy(y): 아래 여백 (1100~1200 구간)
  //   xl(x): 왼쪽 끝 기준, xr(x): 오른쪽 끝 기준, xc(x): 가운데 기준 (시안 여백 m)
  function map(G, top, m = 22) {
    const u = G.u, sh = (160 - top) / 2, fh = G.H - G.bottom, f0 = G.bottom + (fh - 100 * u) / 2;
    return {
      u, hy: (y) => (y + sh) * u, fy: (y) => f0 + (y - 1100) * u,
      xl: (x) => G.L + (x - m) * u, xr: (x) => G.R - (400 - m - x) * u, xc: (x) => G.W / 2 + (x - 200) * u,
      f: (size, rest) => `${rest[0]} ${(size * u).toFixed(1)}px ${rest[1]}`,
    };
  }
  // 은혜 말씀: 사진마다 config.verses에서 랜덤으로 하나 (G.verse). 없으면 삼상 7:12
  // 촬영 날짜 (인생네컷처럼 결과 사진에만): G.date, 없으면 오늘
  const DT = (G) => { if (G.date) return G.date; const d = new Date(), t = (n) => String(n).padStart(2, "0"); return d.getFullYear() + "." + t(d.getMonth() + 1) + "." + t(d.getDate()); };
  const V = (G) => G.verse || { text: "여호와께서 여기까지 우리를 도우셨다", ref: "삼상 7:12" };
  const inset = (s, d, r, rot = 0) => ({ x: s.x + d, y: s.y + d, w: s.w - 2 * d, h: s.h - 2 * d, r, rot });

  const D = {};

  // 흰색 / 검정: 기본 프레임 (제목 + 은혜 말씀 한 줄)
  function plain(name, P) {
    return {
      name, empty: P.empty,
      fonts: ["40px Anton", "500 13px 'Noto Sans KR'", "600 10px Inter"],
      photo: (s, i, G) => inset(s, 0, 2 * G.u),
      draw(ctx, layer, G) {
        const M = map(G, 160), u = M.u, room = G.R - G.L;
        if (layer === "bg") { ctx.fillStyle = P.bg; ctx.fillRect(0, 0, G.W, G.H); return; }
        const title = String(G.title || "Here by Grace").toUpperCase();
        const tf = fitFont(ctx, title, 64 * u, (s) => `${s.toFixed(1)}px Anton, 'Arial Narrow', sans-serif`, room * .62);
        text(ctx, title, G.L, M.hy(96), { font: tf, color: P.ink });
        text(ctx, DT(G), G.R, M.hy(100), { font: M.f(10, ["600", "Inter, sans-serif"]), color: P.sub, align: "right", ls: .12 });
        const v = V(G);
        const rf = M.f(10, ["600", "Inter, 'Noto Sans KR', sans-serif"]), refW = textWidth(ctx, v.ref, rf);
        text(ctx, v.ref, G.R, M.fy(1140), { font: rf, color: P.sub, align: "right" });
        const line = "“" + v.text + "”";
        text(ctx, line, G.L, M.fy(1140), { font: fitFont(ctx, line, 13 * u, (s) => `400 ${s.toFixed(1)}px 'Noto Sans KR', sans-serif`, room - refW - 16 * u), color: P.ink });
        text(ctx, "KEEP THE GRACE ALIVE", G.L, M.fy(1166), { font: M.f(9, ["600", "Inter, sans-serif"]), color: P.sub, ls: .2 });
      },
    };
  }
  D.white = plain("흰색", { bg: "#FFFFFF", ink: "#111111", sub: "#8A8A8A", empty: "#E8E9EE" });
  D.black = plain("검정", { bg: "#111111", ink: "#FFFFFF", sub: "#9A9A9A", empty: "#2A2A2A" });

  // A. 파스텔 무지개
  D.pastel = {
    name: "파스텔 무지개", empty: "#E9E2D6",
    fonts: ["700 44px Caveat", "13px 'Gowun Dodum'"],
    photo: (s, i, G) => inset(s, 0, 14 * G.u),
    draw(ctx, layer, G) {
      const M = map(G, 162), u = M.u;
      if (layer === "bg") { ctx.fillStyle = "#FAF6EF"; ctx.fillRect(0, 0, G.W, G.H); return; }
      const sc = 72 / 86;
      arcs(ctx, G.W / 2, M.hy(46 + 84 * sc), [77, 70, 63, 56, 49, 42, 35].map(r => r * sc * u), RAINBOW_SOFT, 5 * sc * u);
      text(ctx, "Here by Grace", G.W / 2, M.hy(129), { font: M.f(44, ["700", "Caveat, cursive"]), color: "#4A3F35", align: "center" });
      RAINBOW_SOFT.forEach((c, i) => dot(ctx, M.xc(152 + i * 16), M.fy(1132), 5 * u, c));
      const v = V(G);
      text(ctx, v.text, G.W / 2, M.fy(1150), { font: fitFont(ctx, v.text, 13 * u, (z) => `400 ${z.toFixed(1)}px 'Gowun Dodum', sans-serif`, G.R - G.L), color: "#4A3F35", align: "center" });
      text(ctx, DT(G) + " · " + v.ref, G.W / 2, M.fy(1171), { font: M.f(11, ["400", "'Gowun Dodum', sans-serif"]), color: "#6E6152", align: "center" });
    },
  };

  // B. 화이트 미니멀
  D.minimal = {
    name: "화이트 미니멀", empty: "#F1F1F1",
    fonts: ["italic 500 36px Fraunces", "500 11px 'Noto Sans KR'", "10px 'Noto Sans KR'"],
    photo: (s) => inset(s, 0, 0),
    draw(ctx, layer, G) {
      const M = map(G, 134, 24), u = M.u;
      if (layer === "bg") { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, G.W, G.H); return; }
      const tf = M.f(36, ["italic 500", "Fraunces, Georgia, serif"]);
      text(ctx, "Here by", G.L, M.hy(49), { font: tf, color: "#222222", ls: -.01 });
      text(ctx, "Grace.", G.L, M.hy(85), { font: tf, color: "#222222", ls: -.01 });
      const sf = M.f(10, ["400", "'Noto Sans KR', sans-serif"]);
      text(ctx, DT(G), G.R, M.hy(95), { font: sf, color: "#555555", align: "right" });
      const g = ctx.createLinearGradient(G.L, 0, G.R, 0); RAINBOW_SOFT.forEach((c, i) => g.addColorStop(i / 6, c));
      ctx.fillStyle = g; rrect(ctx, G.L, M.hy(116), G.R - G.L, 4 * u, 2 * u); ctx.fill();
      ["#F4A7A0", "#F6E3A1", "#B9D8B4", "#A9CDE8", "#CDB4DB"].forEach((c, i) => foot(ctx, M.xl(24 + i * 18), M.fy(i % 2 ? 1162 : 1158), u, c));
      pin(ctx, M.xl(114), M.fy(1157), u, "#222222", 1.6 * u);
      const v = V(G);
      text(ctx, v.text, G.R, M.fy(1146), { font: fitFont(ctx, v.text, 11 * u, (z) => `400 ${z.toFixed(1)}px 'Noto Sans KR', sans-serif`, G.R - M.xl(140)), color: "#555555", align: "right" });
      text(ctx, "HERE · " + v.ref, G.R, M.fy(1166), { font: M.f(11, ["500", "'Noto Sans KR', sans-serif"]), color: "#222222", align: "right", ls: .18 });
    },
  };

  // C. 은혜 여권 스크랩북 — 칸은 흰 사진 카드, 사진은 그 안쪽. 카드가 살짝 기울고 마스킹테이프
  const PASS_ROT = [-1.2, 1, -.8, 1.3];
  const PASS_TAPE = [[.4, -4, "rgba(244,167,160,.75)"], [.12, 5, "rgba(246,227,161,.85)"], [.66, -3, "rgba(185,216,180,.85)"], [.46, 4, "rgba(205,180,219,.85)"]];
  // 큰 칸일수록 덜 기울게 (단체 1컷 카드가 너무 비뚤어 보이지 않도록)
  const passRot = (s, i) => PASS_ROT[i % 4] * Math.min(1, 1100 / s.w);
  const turn = (ctx, s, rot) => { ctx.translate(s.x + s.w / 2, s.y + s.h / 2); ctx.rotate(rot * Math.PI / 180); };
  D.passport = {
    name: "은혜 여권", empty: "#DCD3C2",
    fonts: ["700 32px Gaegu", "700 10px 'Space Mono'", "10px 'Space Mono'"],
    photo: (s, i, G) => inset(s, 8 * G.u, 0, passRot(s, i)),
    draw(ctx, layer, G) {
      const M = map(G, 124), u = M.u;
      if (layer === "bg") {
        ctx.fillStyle = "#EFE4CF"; ctx.fillRect(0, 0, G.W, G.H);
        G.slots.forEach((s, i) => {   // 사진 카드(흰 테두리 + 그림자)
          ctx.save(); turn(ctx, s, passRot(s, i));
          ctx.shadowColor = "rgba(51,50,94,.18)"; ctx.shadowBlur = 6 * u * G.k; ctx.shadowOffsetY = 2 * u * G.k;
          ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h); ctx.restore();
        });
        return;
      }
      const bx = M.xl(23), bw = M.xr(377) - bx;
      ctx.save(); ctx.setLineDash([6 * u, 4 * u]); ctx.lineWidth = 2 * u; ctx.strokeStyle = "#33325E"; rrect(ctx, bx, M.hy(21), bw, 87.6 * u, 10 * u); ctx.stroke(); ctx.restore();
      text(ctx, "GRACE PASSPORT", M.xl(36), M.hy(37), { font: M.f(10, ["700", "'Space Mono', monospace"]), color: "#33325E", ls: .2 });
      text(ctx, "Here by Grace", M.xl(36), M.hy(62), { font: M.f(32, ["700", "Gaegu, cursive"]), color: "#33325E" });
      text(ctx, "No. " + DT(G), M.xl(36), M.hy(87), { font: M.f(10, ["400", "'Space Mono', monospace"]), color: "#33325E" });
      ctx.save(); ctx.translate(M.xr(331), M.hy(64.8)); ctx.rotate(-12 * Math.PI / 180);
      ctx.strokeStyle = "#E4877E"; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.arc(0, 0, 30 * u, 0, Math.PI * 2); ctx.stroke();
      ["ARRIVED", "BY", "GRACE"].forEach((t, i) => text(ctx, t, 0, (i - 1) * 11.7 * u, { font: M.f(9, ["700", "'Space Mono', monospace"]), color: "#E4877E", align: "center" }));
      ctx.restore();
      G.slots.forEach((s, i) => {   // 테이프: 카드 윗변
        const [fx, rot, col] = PASS_TAPE[i % 4], tw = 70 * u;
        ctx.save(); turn(ctx, s, passRot(s, i));
        ctx.translate(-s.w / 2 + tw / 2 + fx * (s.w - tw), -s.h / 2); ctx.rotate(rot * Math.PI / 180);
        ctx.fillStyle = col; ctx.fillRect(-tw / 2, -9 * u, tw, 18 * u); ctx.restore();
      });
      const c0 = G.L + 17 * u, step = (G.R - G.L - 34 * u) / 6;
      ["#E4877E", "#E9A86E", "#D9B94E", "#7FB07A", "#6FA3CF", "#7C82C8", "#A887BF"].forEach((c, i) => {
        ctx.strokeStyle = c; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.arc(c0 + i * step, M.fy(1132.5), 16 * u, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.save(); ctx.setLineDash([5 * u, 3 * u]); ctx.lineWidth = 1.5 * u; ctx.strokeStyle = "#33325E"; ctx.beginPath(); ctx.moveTo(G.L, M.fy(1158)); ctx.lineTo(G.R, M.fy(1158)); ctx.stroke(); ctx.restore();
      const f = M.f(10, ["400", "'Space Mono', monospace"]);
      text(ctx, "FROM: 은혜", G.L, M.fy(1172), { font: f, color: "#33325E" });
      text(ctx, "TO: HERE", G.W / 2, M.fy(1172), { font: f, color: "#33325E", align: "center" });
      const v = V(G);
      text(ctx, v.ref, G.R, M.fy(1172), { font: f, color: "#33325E", align: "right" });
      text(ctx, v.text, G.W / 2, M.fy(1103), { font: fitFont(ctx, v.text, 11 * u, (z) => `500 ${z.toFixed(1)}px 'Noto Sans KR', sans-serif`, G.R - G.L), color: "#33325E", align: "center" });
    },
  };

  // D. 성도교제의 밤 (다크)
  const NIGHT_BORDER = ["#FF9E94", "#FFE69A", "#9CD3FF", "#E2B6FF"];
  D.night = {
    name: "성도교제의 밤", empty: "#222A4A",
    fonts: ["italic 40px 'DM Serif Display'", "700 14px 'Gowun Batang'", "11px 'Gowun Batang'"],
    photo: (s, i, G) => inset(s, 0, 18 * G.u),
    draw(ctx, layer, G) {
      const M = map(G, 164), u = M.u;
      if (layer === "bg") {
        ctx.fillStyle = "#141A33"; ctx.fillRect(0, 0, G.W, G.H);
        for (const [x, y, s, c] of [[M.xl(40), M.hy(30), 3, "#F6E3A1"], [M.xr(330), M.hy(70), 2, "#FFFFFF"], [M.xc(250), M.hy(18), 2, "#FFFFFF"], [M.xl(24), M.hy(110), 2, "#A9CDE8"], [M.xr(360), M.fy(1150), 3, "#F6E3A1"]])
          dot(ctx, x, y, s / 2 * u, c);
        return;
      }
      const sc = 62 / 76;
      ctx.save(); ctx.shadowColor = "rgba(205,180,219,.6)"; ctx.shadowBlur = 6 * u * G.k;
      arcs(ctx, G.W / 2, M.hy(44 + 74 * sc), [69, 61, 53, 45, 37, 29, 21].map(r => r * sc * u), ["#FF9E94", "#FFC28A", "#FFE69A", "#A8E6A3", "#9CD3FF", "#A7AEFF", "#E2B6FF"], 2.5 * sc * u);
      ctx.restore();
      text(ctx, "Here by Grace", G.W / 2, M.hy(130), { font: M.f(40, ["italic 400", "'DM Serif Display', Georgia, serif"]), color: "#F3EEDF", align: "center" });
      G.photos.forEach((p, i) => { ctx.strokeStyle = NIGHT_BORDER[i % 4]; ctx.lineWidth = 1.5 * u; rrect(ctx, p.x + .75 * u, p.y + .75 * u, p.w - 1.5 * u, p.h - 1.5 * u, p.r - .75 * u); ctx.stroke(); });
      const v = V(G);
      text(ctx, v.text, G.W / 2, M.fy(1150), { font: fitFont(ctx, v.text, 14 * u, (z) => `700 ${z.toFixed(1)}px 'Gowun Batang', serif`, G.R - G.L), color: "#F3EEDF", align: "center" });
      text(ctx, DT(G) + " · " + v.ref, G.W / 2, M.fy(1172), { font: M.f(11, ["400", "'Gowun Batang', serif"]), color: "#B9BDD3", align: "center", ls: .08 });
    },
  };

  // E. 홀로그램 Y2K — 칸 = 흰 테두리 바깥선, 사진은 5만큼 안쪽
  D.holo = {
    name: "홀로그램", empty: "rgba(255,255,255,.55)",
    fonts: ["46px 'Bagel Fat One'", "700 11px 'Noto Sans KR'", "500 11px 'Noto Sans KR'"],
    photo: (s, i, G) => inset(s, 5 * G.u, 19 * G.u),
    draw(ctx, layer, G) {
      const M = map(G, 158), u = M.u;
      if (layer === "bg") {
        const a = 160 * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), len = Math.abs(G.W * dx) + Math.abs(G.H * dy);
        const g = ctx.createLinearGradient(G.W / 2 - dx * len / 2, G.H / 2 - dy * len / 2, G.W / 2 + dx * len / 2, G.H / 2 + dy * len / 2);
        [["#FDE2EC", 0], ["#FFF3D6", .22], ["#DDF5E6", .45], ["#DCEBFF", .68], ["#EADFFF", 1]].forEach(([c, p]) => g.addColorStop(p, c));
        ctx.fillStyle = g; ctx.fillRect(0, 0, G.W, G.H); return;
      }
      const bf = M.f(11, ["700", "'Noto Sans KR', sans-serif"]), badge = DT(G), bw = textWidth(ctx, badge, bf, .2) + 24 * u;
      const total = 26 * u + bw + 22 * u, x0 = G.W / 2 - total / 2;
      spark(ctx, x0, M.hy(49), 18 * u, "#FFFFFF");
      ctx.fillStyle = "#3A2F6B"; rrect(ctx, x0 + 26 * u, M.hy(46), bw, 24 * u, 12 * u); ctx.fill();
      text(ctx, badge, x0 + 26 * u + bw / 2, M.hy(58), { font: bf, color: "#FFFFFF", align: "center", ls: .2 });
      spark(ctx, x0 + 26 * u + bw + 8 * u, M.hy(51), 14 * u, "#FFFFFF");
      text(ctx, "Here by Grace", G.W / 2, M.hy(99), { font: M.f(46, ["400", "'Bagel Fat One', sans-serif"]), color: "#FFFFFF", align: "center", stroke: "#3A2F6B", strokeW: 2 * u });
      G.photos.forEach(p => { ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 5 * u; rrect(ctx, p.x - 2.5 * u, p.y - 2.5 * u, p.w + 5 * u, p.h + 5 * u, p.r + 2.5 * u); ctx.stroke(); });
      const pf = M.f(12, ["700", "'Noto Sans KR', sans-serif"]), pw = 30 * u + textWidth(ctx, "HERE", pf) + 12 * u, px = G.L - 2 * u;
      ctx.fillStyle = "#FFFFFF"; rrect(ctx, px, M.fy(1151), pw, 29 * u, 14.5 * u); ctx.fill();
      pin(ctx, px + 12 * u, M.fy(1158), 12 / 14 * u, "#3A2F6B", 2 * u);
      text(ctx, "HERE", px + 30 * u, M.fy(1166), { font: pf, color: "#3A2F6B" });
      const v = V(G), vt = v.text + " · " + v.ref;
      text(ctx, vt, G.R + 2 * u, M.fy(1166), { font: fitFont(ctx, vt, 11 * u, (z) => `500 ${z.toFixed(1)}px 'Noto Sans KR', sans-serif`, G.R - px - pw - 12 * u), color: "#3A2F6B", align: "right" });
    },
  };

  // 예수님 자리: 카메라가 눈높이, 1.2m쯤 떨어져 선 사람과 머리 크기·눈높이가 맞도록
  //   scale: 칸 높이 대비 이미지 높이, drop: 위에서 내려오는 정도(아래쪽은 칸 밖으로 잘림), left: 왼쪽 여백 (모두 칸 크기 대비)
  function jesusRect(p, img, o = {}) {
    const scale = o.scale ?? 1, drop = o.drop ?? .16, left = o.left ?? .06;
    const h = p.h * scale, w = h * img.width / img.height;
    return { x: p.x + p.w * left, y: p.y + p.h * drop, w, h };
  }
  window.jesusRect = jesusRect;

  // F. 주님과 함께 — 각 컷 왼쪽 아래에 같은 번호의 예수님 포즈 (G.jesus: 이미지 4장, 모두 있을 때만 목록에 나옴)
  D.withjesus = {
    name: "주님과 함께", empty: "#E9E2D6", needs: "jesus",
    fonts: ["40px Italiana", "700 14px 'Gowun Batang'", "400 11px 'Gowun Batang'"],
    photo: (s, i, G) => inset(s, 0, 12 * G.u),
    // 사진 위에 예수님. 크기·위치는 jesusRect (촬영 화면 안내 이미지도 같은 계산). 칸 밖은 잘림(호출하는 쪽에서 칸 모양으로 clip)
    over(ctx, p, pose, G) {
      const j = G.jesus && G.jesus[pose % G.jesus.length]; if (!j) return;
      const r = jesusRect(p, j, G.jesusFit); ctx.drawImage(j, r.x, r.y, r.w, r.h);
    },
    draw(ctx, layer, G) {
      const M = map(G, 160), u = M.u;
      if (layer === "bg") { ctx.fillStyle = "#FAF6EF"; ctx.fillRect(0, 0, G.W, G.H); return; }
      text(ctx, "WITH JESUS", G.W / 2, M.hy(74), { font: fitFont(ctx, "WITH JESUS", 50 * u, (z) => `400 ${z.toFixed(1)}px Italiana, Georgia, serif`, G.R - G.L), color: "#3E352C", align: "center", ls: .14 });
      text(ctx, "주님과 함께", G.W / 2, M.hy(116), { font: M.f(15, ["700", "'Gowun Batang', serif"]), color: "#6E6152", align: "center", ls: .12 });
      const g = ctx.createLinearGradient(G.W / 2 - 40 * u, 0, G.W / 2 + 40 * u, 0); RAINBOW_SOFT.forEach((c, k) => g.addColorStop(k / 6, c));
      ctx.fillStyle = g; rrect(ctx, G.W / 2 - 40 * u, M.hy(136), 80 * u, 3 * u, 1.5 * u); ctx.fill();
      const line = "나의 나 된 것은 하나님의 은혜라 · 고전 15:10";
      text(ctx, line, G.W / 2, M.fy(1142), { font: fitFont(ctx, line, 14 * u, (z) => `400 ${z.toFixed(1)}px 'Gowun Batang', serif`, G.R - G.L), color: "#3E352C", align: "center" });
      text(ctx, DT(G), G.W / 2, M.fy(1168), { font: M.f(11, ["400", "'Gowun Batang', serif"]), color: "#8A7D70", align: "center", ls: .12 });
    },
  };

  window.FRAME_STYLES = D;
})();
