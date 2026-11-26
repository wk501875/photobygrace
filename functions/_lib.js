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
export const FONTS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600&family=Playfair+Display:ital,wght@0,700;1,400&display=swap"><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">`;

// 휴대폰 다운로드 화면 — 촬영 화면과 같은 코지 미니멀 (아이보리, 골드, 세이지 그린)
export function page(title, inner) {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#FAF8F5">
<title>${title}</title>
${FONTS}
<style>
  :root { --cream:#FAF8F5; --gold:#D9A760; --green:#4A5D4E; --text:#2C2A29; --sub:#7A7571; --border:#E8E3DC; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { min-height:100dvh; background:var(--cream); color:var(--text); font-family:Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif; }
  main { max-width:480px; margin:0 auto; text-align:center;
         padding: max(32px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(32px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left)); }
  .badge { display:inline-block; font-size:12px; letter-spacing:.15em; color:var(--green); border:1px solid rgba(74,93,78,.3); padding:6px 14px; border-radius:100px; font-weight:600; }
  h1 { font-family:"Playfair Display",Georgia,serif; font-weight:700; font-size:44px; letter-spacing:-.02em; margin:16px 0 0; }
  h1 em { font-style:italic; font-weight:400; color:var(--gold); }
  .photo { display:block; max-height:56dvh; max-width:100%; width:auto; height:auto; margin:26px auto; border-radius:4px; box-shadow:0 20px 45px rgba(0,0,0,.14); -webkit-touch-callout: default; }
  .btn { display:block; width:100%; font-size:18px; font-weight:600; padding:18px; border-radius:100px; text-decoration:none; color:#fff; background:var(--green); box-shadow:0 10px 25px rgba(74,93,78,.25); }
  .btn:active { transform:scale(.98); }
  .tip { color:var(--sub); font-size:13px; line-height:1.7; margin-top:14px; }
  .verse { margin-top:30px; font-family:"Noto Serif KR",serif; font-size:16px; }
  .verse span { display:block; margin-top:6px; font-family:Pretendard,sans-serif; font-size:13px; color:var(--sub); }
  .empty { margin:40px 0 10px; color:var(--sub); line-height:1.7; }
</style></head><body><main>
<span class="badge">2026 성도교제의 밤</span>
${inner}
<p class="verse">“나의 나 된 것은 다 하나님의 은혜로 된 것이니”<span>고린도전서 15:10</span></p>
</main></body></html>`;
}
