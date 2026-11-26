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

export function page(title, inner) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Caveat:wght@600&display=swap">
<style>
  :root { --bg:#f4f5f8; --panel:#fff; --fg:#1d2030; --muted:#6b7083; --line:#e1e3ea; --accent:#3949ab; --accent-fg:#fff; }
  @media (prefers-color-scheme: dark) { :root { --bg:#12141c; --panel:#1c1f2b; --fg:#eceef5; --muted:#9a9fb3; --line:#2c3040; --accent:#7986cb; --accent-fg:#0f1120; color-scheme:dark; } }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font-family:"Gowun Dodum",system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif; }
  main { max-width:520px; margin:0 auto; padding:24px 16px 40px; text-align:center; }
  h1 { font-family:"Caveat",cursive; font-size:48px; margin:0; line-height:1.1; }
  .muted { color:var(--muted); }
  .photo { height:min(58vh,960px); width:auto; max-width:90%; border-radius:8px; box-shadow:0 6px 24px rgba(0,0,0,.18); margin:16px auto; display:block; }
  .btn { display:inline-block; font:inherit; font-size:18px; padding:14px 28px; border-radius:12px; border:0; background:var(--accent); color:var(--accent-fg); text-decoration:none; cursor:pointer; }
  .btn.ghost { background:transparent; color:var(--fg); border:1px solid var(--line); font-size:15px; padding:10px 16px; }
  .btn:focus-visible { outline:3px solid var(--accent); outline-offset:2px; }
</style></head><body><main>${inner}</main></body></html>`;
}
