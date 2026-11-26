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
export const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oranienbaum&family=Montserrat:wght@500;600&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@600;700&display=swap">`;

export function page(title, inner) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#26398b">
<title>${title}</title>
${FONTS}
<style>
  :root { color-scheme: dark; --bg:#26398b; --line:rgba(255,255,255,.24); --ink:#fff; --mute:rgba(233,236,250,.72); --on-ink:#26398b; }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100dvh; background:var(--bg); color:var(--ink);
         font-family:"Noto Sans KR",system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif; }
  main { max-width:480px; margin:0 auto; text-align:center;
         padding: max(28px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(28px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); }
  .kicker { font-family:"Montserrat",sans-serif; font-weight:500; letter-spacing:.32em; text-transform:uppercase; font-size:15px; margin:0; }
  h1 { font-family:"Oranienbaum","Bodoni 72",Didot,serif; font-weight:400; font-size:88px; line-height:.85; margin:6px 0 0; text-transform:uppercase; }
  .sub { color:var(--mute); margin:12px 0 0; font-size:14px; }
  .photo { display:block; max-height:52dvh; max-width:100%; width:auto; height:auto; margin:24px auto; box-shadow:0 24px 40px -20px rgba(8,14,48,.6); -webkit-touch-callout: default; }
  .btn { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; font:inherit; font-size:18px; font-weight:700; padding:18px; border-radius:999px;
         text-decoration:none; color:var(--on-ink); background:#fff; }
  .btn::after { content:"↓"; font-family:"Montserrat",sans-serif; font-weight:500; }
  .btn:active { transform:scale(.98); }
  .btn:focus-visible { outline:3px solid #fff; outline-offset:3px; }
  .tip { color:var(--mute); font-size:13px; line-height:1.7; margin:14px 0 0; }
  .verse { margin:28px 0 0; padding-top:18px; border-top:1px solid var(--line); font-family:"Noto Serif KR",serif; font-size:16px; }
  .verse span { display:block; margin-top:6px; font-family:"Montserrat",sans-serif; font-size:11px; letter-spacing:.24em; color:var(--mute); }
  .empty { margin:40px 0 10px; color:var(--mute); line-height:1.7; }
</style></head><body><main>
${inner}
<p class="verse">여호와께서 여기까지 우리를 도우셨다<span>사무엘상 7:12</span></p>
</main></body></html>`;
}
