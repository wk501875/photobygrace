// POST /admin/delete?id=... — 사진 한 장 삭제
import { json, ID_RE, keyOf } from "../_lib.js";

export async function onRequestPost({ request, env }) {
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!ID_RE.test(id)) return json({ ok: false, error: "잘못된 사진 ID" }, 400);
  await env.PHOTOS.delete(keyOf(id));
  return json({ ok: true });
}
