// GET /admin — 사진 관리 페이지 (목록, 저장, 삭제)
import { html, TITLE, FONTS } from "../_lib.js";

export async function onRequestGet() {
  return html(`<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${TITLE} 사진 관리</title>
${FONTS}
<style>
  :root { color-scheme: light; --bg:#FAF8F5; --card:#fff; --soft:#F1EDE7; --line:#E8E3DC; --ink:#2C2A29; --mute:#7A7571; --danger:#b3261e; --green:#4A5D4E; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); min-height:100dvh; font-family:Pretendard,system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif; }
  header { max-width:1200px; margin:0 auto; padding:28px max(16px, env(safe-area-inset-right)) 8px max(16px, env(safe-area-inset-left));
           display:flex; align-items:flex-end; gap:16px; flex-wrap:wrap; }
  .label { font-family:Pretendard,system-ui,sans-serif; font-weight:500; font-size:11px; letter-spacing:.24em; text-transform:uppercase; color:var(--mute); }
  h1 { margin:6px 0 0; font-family:"Playfair Display",Georgia,serif; font-weight:700; font-size:40px; letter-spacing:-.02em; }
  .muted { color:var(--mute); font-size:14px; font-variant-numeric:tabular-nums; margin-top:8px; }
  .grow { flex:1; min-width:0; }
  .refresh { font:inherit; font-size:14px; font-weight:600; padding:10px 18px; border-radius:100px; border:0; background:var(--green); color:#fff; cursor:pointer; }
  .grid { max-width:1200px; margin:0 auto; padding:16px max(16px, env(safe-area-inset-right)) 40px max(16px, env(safe-area-inset-left));
          display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:14px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:6px; padding:10px; display:flex; flex-direction:column; gap:8px; }
  .card img { width:100%; aspect-ratio:1/3; object-fit:cover; background:var(--soft); }
  .meta { font-family:Pretendard,system-ui,sans-serif; font-size:12px; color:var(--mute); font-variant-numeric:tabular-nums; }
  .row { display:flex; gap:6px; }
  .row a, .row button { flex:1; font:inherit; font-size:13px; padding:8px 6px; border-radius:4px; border:1px solid var(--line); background:transparent; color:var(--ink); text-align:center; text-decoration:none; cursor:pointer; }
  .row button.armed { background:var(--danger); border-color:var(--danger); color:#fff; }
  .empty { grid-column:1/-1; text-align:center; color:var(--mute); padding:60px 0; }
  a:focus-visible, button:focus-visible { outline:3px solid #D9A760; outline-offset:2px; }
</style></head><body>
<header>
  <div class="grow"><span class="label">사진 관리</span><h1>Here <em style="font-style:italic;font-weight:400;color:#D9A760">by</em> Grace</h1><div class="muted" id="sum">불러오는 중…</div></div>
  <button class="refresh" id="refresh" type="button">새로고침</button>
</header>
<div class="grid" id="grid"></div>
<script>
  const grid = document.getElementById("grid"), sum = document.getElementById("sum");
  const fmt = (b) => b > 1e9 ? (b / 1e9).toFixed(2) + " GB" : (b / 1e6).toFixed(1) + " MB";
  let count = 0, bytes = 0;
  const showSum = () => { sum.textContent = "사진 " + count + "장 · " + fmt(bytes) + " / 무료 10 GB"; };
  document.getElementById("refresh").onclick = load;
  async function load() {
    const r = await fetch("/admin/list"); const j = await r.json();
    if (!j.ok) { sum.textContent = j.error || "목록을 불러오지 못했어요."; return; }
    count = j.count; bytes = j.bytes; showSum();
    grid.innerHTML = "";
    if (!j.items.length) { grid.innerHTML = '<p class="empty">아직 찍은 사진이 없어요. 촬영하면 여기에 최신순으로 보여요.</p>'; return; }
    for (const it of j.items) {
      const c = document.createElement("div"); c.className = "card";
      const img = document.createElement("img"); img.loading = "lazy"; img.src = "/img/" + it.id; img.alt = "";
      const meta = document.createElement("div"); meta.className = "meta";
      meta.textContent = new Date(it.created).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
      const row = document.createElement("div"); row.className = "row";
      const a = document.createElement("a"); a.href = "/img/" + it.id + "?dl=1"; a.textContent = "저장";
      const del = document.createElement("button"); del.type = "button"; del.textContent = "삭제";
      let t;
      del.onclick = async () => {
        if (!del.classList.contains("armed")) {
          del.classList.add("armed"); del.textContent = "한 번 더";
          t = setTimeout(() => { del.classList.remove("armed"); del.textContent = "삭제"; }, 3000); return;
        }
        clearTimeout(t); del.disabled = true;
        const d = await fetch("/admin/delete?id=" + it.id, { method: "POST" });
        if ((await d.json()).ok) { c.remove(); count--; bytes -= it.size; showSum(); } else { del.disabled = false; del.textContent = "실패"; }
      };
      row.append(a, del); c.append(img, meta, row); grid.append(c);
    }
  }
  load();
</script>
</body></html>`);
}
