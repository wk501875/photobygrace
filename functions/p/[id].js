// GET /p/:id — QR을 찍으면 열리는 사진 다운로드 페이지
import { ID_RE, keyOf, TITLE, html, page } from "../_lib.js";

export async function onRequestGet({ params, env }) {
  const id = String(params.id || "");
  const exists = ID_RE.test(id) && env.PHOTOS && (await env.PHOTOS.head(keyOf(id)));
  if (!exists) {
    return html(page(TITLE, `<p class="kicker">Here by</p><h1>Grace</h1>
      <p class="empty">사진을 찾을 수 없어요.<br>보관 기간이 지났거나 주소가 잘못되었을 수 있어요.</p>`), 404);
  }
  return html(page(TITLE, `<p class="kicker">Here by</p><h1>Grace</h1>
    <p class="sub">성도교제의 밤</p>
    <img class="photo" src="/img/${id}" alt="네컷 사진">
    <a class="btn" href="/img/${id}?dl=1">사진 저장하기</a>
    <p class="tip">버튼이 안 되면 사진을 길게 눌러 저장해 주세요.</p>`));
}
