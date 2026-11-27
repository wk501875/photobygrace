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

// 휴대폰용 페이지 틀 — 키오스크 시작화면과 같은 톤 (따뜻한 크림, 얇은 세리프 + 고운바탕)
export const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Italiana&family=Gowun+Batang:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&display=swap">`;

export function page(title, inner) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#EEE6D8">
<title>${title}</title>
${FONTS}
<style>
  :root { color-scheme: light; --bg:#EEE6D8; --card:#FBF8F2; --line:#E2D7C5; --ink:#3A3029; --mute:#8A7D70; }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100dvh; color:var(--ink); letter-spacing:-0.01em;
         background: radial-gradient(ellipse 100% 60% at 50% 0%, #FBF6EC 0%, var(--bg) 75%) fixed, var(--bg);
         font-family:"Noto Sans KR",system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif; }
  main { max-width:480px; margin:0 auto;
         padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); }
  .card { background:var(--card); border-radius:26px; padding:26px 22px 26px; text-align:center; box-shadow:0 20px 50px -38px rgba(58,48,41,.45); }
  .label { font-family:"Gowun Batang",serif; font-size:12px; letter-spacing:.2em; text-transform:uppercase; color:#7A6D61; }
  h1 { font-family:"Italiana",Georgia,serif; font-weight:400; font-size:clamp(24px, 7.6vw, 40px); white-space:nowrap; letter-spacing:.08em; line-height:1.05; margin:14px 0 0; text-transform:uppercase; }
  .sub { color:var(--mute); margin:8px 0 0; font-size:14px; font-family:"Gowun Batang",serif; }
  .photo { display:block; height:min(52dvh,880px); width:auto; max-width:100%; margin:22px auto; box-shadow:0 20px 36px -22px rgba(58,48,41,.45); -webkit-touch-callout: default; }
  .btn { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; font:inherit; font-size:18px; font-weight:700; padding:19px; border-radius:999px;
         text-decoration:none; color:#FBF6EC; background:var(--ink); box-shadow:0 14px 30px -18px rgba(58,48,41,.6); }
  .btn::after { content:"↓"; font-family:Georgia,serif; font-weight:400; }
  .btn:active { transform:scale(.98); }
  .btn:focus-visible { outline:3px solid var(--ink); outline-offset:3px; }
  .tip { color:var(--mute); font-size:13px; line-height:1.7; margin:14px 0 0; }
  .verse { margin:22px 4px 0; text-align:center; color:var(--mute); font-family:"Gowun Batang",serif; font-size:13px; line-height:1.8; }
  .verse b { display:block; color:var(--ink); font-weight:400; font-size:16px; }
  .empty { margin:40px 0 10px; color:var(--mute); line-height:1.7; }
</style></head><body><main>
<div class="card"><span class="label">Photo Booth · 성도교제의 밤</span>${inner}</div>
<p class="verse"><b>나의 나 된 것은 하나님의 은혜라</b>고린도전서 15:10</p>
</main></body></html>`;
}
