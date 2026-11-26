// POST /api/upload — 촬영 노트북이 완성된 네컷(JPEG)을 올림
// 헤더 X-Event-Code 가 EVENT_CODE 와 같아야 하고, 응답으로 QR에 넣을 다운로드 페이지 주소를 돌려줌
import { json, newId, keyOf, safeEqual } from "../_lib.js";

const MAX_BYTES = 5 * 1024 * 1024;

export async function onRequestPost({ request, env }) {
  if (!env.PHOTOS) return json({ ok: false, error: "R2 버킷(PHOTOS)이 연결되지 않았어요." }, 500);
  if (!env.EVENT_CODE) return json({ ok: false, error: "EVENT_CODE가 설정되지 않았어요." }, 500);
  if (!safeEqual(request.headers.get("X-Event-Code"), env.EVENT_CODE)) return json({ ok: false, error: "행사 코드가 맞지 않아요." }, 401);

  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > MAX_BYTES) return json({ ok: false, error: "사진이 너무 커요." }, 413);
  const buf = await request.arrayBuffer();
  if (buf.byteLength === 0 || buf.byteLength > MAX_BYTES) return json({ ok: false, error: "사진 크기가 올바르지 않아요." }, 413);
  const b = new Uint8Array(buf, 0, 3);
  if (b[0] !== 0xff || b[1] !== 0xd8 || b[2] !== 0xff) return json({ ok: false, error: "JPEG 사진만 올릴 수 있어요." }, 415);

  const id = newId();
  await env.PHOTOS.put(keyOf(id), buf, {
    httpMetadata: { contentType: "image/jpeg" },
    customMetadata: { created: new Date().toISOString() },
  });
  const origin = new URL(request.url).origin;
  return json({ ok: true, id, page: `${origin}/p/${id}` });
}
