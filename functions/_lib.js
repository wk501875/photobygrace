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

// 무지개 로고 (촬영 화면과 같은 모양)
export const RAINBOW_SVG = `<svg class="logo" viewBox="0 0 64 36" aria-hidden="true"><g fill="none" stroke-width="3.2" stroke-linecap="round">
<path d="M4 34a28 28 0 0 1 56 0" stroke="#ef5350"/><path d="M8 34a24 24 0 0 1 48 0" stroke="#ffa726"/>
<path d="M12 34a20 20 0 0 1 40 0" stroke="#ffee58"/><path d="M16 34a16 16 0 0 1 32 0" stroke="#66bb6a"/>
<path d="M20 34a12 12 0 0 1 24 0" stroke="#42a5f5"/><path d="M24 34a8 8 0 0 1 16 0" stroke="#5c6bc0"/>
<path d="M28 34a4 4 0 0 1 8 0" stroke="#ab47bc"/></g></svg>`;

// 휴대폰용 페이지 틀 — 촬영 화면과 같은 밤하늘 + 무지개
export function page(title, inner) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0e1324">
<title>${title}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Caveat:wght@700&display=swap">
<style>
  :root { color-scheme: dark; --night:#0e1324; --night-2:#161d35; --star:#f3f1ea; --mist:#a3abc7; --line:rgba(255,255,255,.1);
          --rainbow: linear-gradient(90deg,#ef5350,#ffa726,#ffee58,#66bb6a,#42a5f5,#5c6bc0,#ab47bc); }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100dvh; color:var(--star);
         background: radial-gradient(120% 60% at 80% -10%, #26305a 0%, transparent 60%), var(--night);
         font-family:"Gowun Dodum",system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif; }
  main { max-width:480px; margin:0 auto; text-align:center;
         padding: max(28px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(32px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); }
  .logo { width:64px; height:36px; display:block; margin:0 auto 6px; }
  h1 { font-family:"Caveat",cursive; font-weight:700; font-size:46px; margin:0; line-height:1; }
  .sub { color:var(--mist); margin:6px 0 0; font-size:15px; letter-spacing:.5px; }
  .photo { display:block; height:min(50dvh,900px); width:auto; max-width:88%; margin:22px auto 24px; border-radius:8px;
           box-shadow:0 18px 40px -16px rgba(0,0,0,.9), 0 0 0 1px var(--line); -webkit-touch-callout: default; }
  .btn { display:block; width:100%; font:inherit; font-size:20px; padding:18px; border-radius:20px; text-decoration:none; color:var(--night);
         border:4px solid transparent; background: linear-gradient(var(--star),var(--star)) padding-box, var(--rainbow) border-box; }
  .btn:active { transform: scale(.98); }
  .btn:focus-visible { outline:3px solid #42a5f5; outline-offset:3px; }
  .tip { color:var(--mist); font-size:14px; line-height:1.7; margin:16px 0 0; }
  .verse { margin:34px 0 0; padding-top:18px; border-top:1px solid var(--line); color:var(--mist); font-size:14px; line-height:1.6; }
  .verse b { display:block; color:var(--star); font-weight:400; font-size:16px; }
  .empty { margin-top:40px; color:var(--mist); line-height:1.7; }
</style></head><body><main>${RAINBOW_SVG}${inner}
<p class="verse"><b>여호와께서 여기까지 우리를 도우셨다</b>사무엘상 7:12</p>
</main></body></html>`;
}
