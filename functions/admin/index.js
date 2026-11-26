// GET /admin — 사진 관리 페이지 (목록, 저장, 삭제)
import { html, TITLE } from "../_lib.js";

export async function onRequestGet() {
  return html(`<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${TITLE} 사진 관리</title>
<style>
  :root { --bg:#f4f5f8; --panel:#fff; --fg:#1d2030; --muted:#6b7083; --line:#e1e3ea; --accent:#3949ab; --danger:#c62828; }
  @media (prefers-color-scheme: dark) { :root { --bg:#12141c; --panel:#1c1f2b; --fg:#eceef5; --muted:#9a9fb3; --line:#2c3040; --accent:#7986cb; --danger:#ef5350; color-scheme:dark; } }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font-family:system-ui,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif; }
  header { padding:20px 16px 8px; max-width:1200px; margin:0 auto; }
  h1 { margin:0 0 4px; font-size:22px; }
  .muted { color:var(--muted); font-size:14px; }
  .grid { max-width:1200px; margin:0 auto; padding:12px 16px 40px; display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:14px; }
  .card { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:8px; display:flex; flex-direction:column; gap:6px; }
  .card img { width:100%; aspect-ratio:1/3; object-fit:cover; border-radius:6px; background:var(--line); }
  .meta { font-size:12px; color:var(--muted); font-variant-numeric:tabular-nums; }
  .row { display:flex; gap:6px; }
  .row a, .row button { flex:1; font:inherit; font-size:13px; padding:6px; border-radius:6px; border:1px solid var(--line); background:transparent; color:var(--fg); text-align:center; text-decoration:none; cursor:pointer; }
  .row button.armed { background:var(--danger); border-color:var(--danger); color:#fff; }
</style></head><body>
<header>
  <h1>${TITLE} 사진 관리</h1>
  <div class="muted" id="sum">불러오는 중…</div>
</header>
<div class="grid" id="grid"></div>
<script>
  const grid = document.getElementById("grid"), sum = document.getElementById("sum");
  const fmt = (b) => b > 1e9 ? (b / 1e9).toFixed(2) + " GB" : (b / 1e6).toFixed(1) + " MB";
  async function load() {
    const r = await fetch("/admin/list"); const j = await r.json();
    if (!j.ok) { sum.textContent = j.error || "목록을 불러오지 못했어요."; return; }
    sum.textContent = "사진 " + j.count + "장 · " + fmt(j.bytes) + " (무료 한도 10 GB)";
    grid.innerHTML = "";
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
        if ((await d.json()).ok) c.remove(); else { del.disabled = false; del.textContent = "실패"; }
      };
      row.append(a, del); c.append(img, meta, row); grid.append(c);
    }
  }
  load();
</script>
</body></html>`);
}
