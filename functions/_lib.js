// 공통 도우미 — Cloudflare Pages Functions
// 필요한 설정 (Pages 프로젝트 → Settings):
//   R2 바인딩     PHOTOS          → 사진 저장 버킷
//   비밀 변수     EVENT_CODE      → 촬영 노트북에서 업로드할 때 쓰는 행사 코드
//   비밀 변수     ADMIN_PASSWORD  → /admin 사진 관리 페이지 비밀번호

export const TITLE = "Here by Grace";
export const ID_RE = /^[a-z0-9]{14}$/;
export const keyOf = (id) => `p/${id}.jpg`;

// 시간순으로 정렬되는 사진 ID: 밀리초 타임스탬프(36진수 8자리) + 무작위 6자리
export function newId() {
  const t = Date.now().toString(36).padStart(8, "0");
  const abc = "abcdefghijklmnopqrstuvwxyz0123456789";
  const r = crypto.getRandomValues(new Uint8Array(6));
  return t + Array.from(r, (b) => abc[b % 36]).join("");
}

export const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

export const html = (body, status = 200) =>
  new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });

// 길이가 같을 때만 비교하는 단순 상수 시간 비교
export function safeEqual(a, b) {
  a = String(a || ""); b = String(b || "");
  if (!a || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

// 휴대폰용 페이지 틀 — 촬영 화면과 같은 흑백 에디토리얼
export const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@500;600&family=Noto+Sans+KR:wght@400;500;700&display=swap">`;

export function page(title, inner) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#ececec">
<title>${title}</title>
${FONTS}
<style>
  :root { color-scheme: light; --bg:#ececec; --card:#fff; --soft:#f3f3f3; --line:#e1e1e1; --ink:#111; --mute:#8a8a8a; }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100dvh; background:var(--bg); color:var(--ink); letter-spacing:-0.01em;
         font-family:"Noto Sans KR",system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif; }
  main { max-width:480px; margin:0 auto;
         padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); }
  .card { background:var(--card); border-radius:28px; padding:24px 22px 26px; }
  .label { font-family:"Inter",system-ui,sans-serif; font-weight:600; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--mute); }
  .top { display:flex; justify-content:space-between; }
  h1 { font-family:"Anton","Arial Narrow",sans-serif; font-weight:400; font-size:52px; line-height:.9; margin:14px 0 0; text-transform:uppercase; }
  .sub { color:var(--mute); margin:8px 0 0; font-size:14px; }
  .photo { display:block; height:min(52dvh,880px); width:auto; max-width:100%; margin:22px auto; box-shadow:0 1px 0 var(--line), 0 20px 36px -22px rgba(0,0,0,.4); -webkit-touch-callout: default; }
  .btn { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; font:inherit; font-size:18px; font-weight:700; padding:19px; border-radius:999px;
         text-decoration:none; color:#fff; background:var(--ink); }
  .btn::after { content:"↓"; font-family:"Inter",sans-serif; font-weight:500; }
  .btn:active { transform:scale(.98); }
  .btn:focus-visible { outline:3px solid var(--ink); outline-offset:3px; }
  .tip { color:var(--mute); font-size:13px; line-height:1.7; margin:14px 0 0; text-align:center; }
  .verse { margin:18px 4px 0; display:flex; justify-content:space-between; gap:12px; align-items:baseline; color:var(--mute); font-size:13px; }
  .verse b { color:var(--ink); font-weight:500; }
  .empty { margin:40px 0 10px; color:var(--mute); line-height:1.7; }
</style></head><body><main>
<div class="card"><div class="top"><span class="label">Photo Booth ✦</span><span class="label">Keep the grace alive</span></div>${inner}</div>
<p class="verse"><b>여호와께서 여기까지 우리를 도우셨다</b><span>삼상 7:12</span></p>
</main></body></html>`;
}
