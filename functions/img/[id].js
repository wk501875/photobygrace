// GET /img/:id — 사진 파일. ?dl=1 이면 다운로드로 받음
import { ID_RE, keyOf } from "../_lib.js";

export async function onRequestGet({ request, params, env }) {
  const id = String(params.id || "").replace(/\.jpg$/, "");
  if (!ID_RE.test(id) || !env.PHOTOS) return new Response("Not found", { status: 404 });
  const obj = await env.PHOTOS.get(keyOf(id));
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers({
    "Content-Type": "image/jpeg",
    "Cache-Control": "public, max-age=86400",
    "ETag": obj.httpEtag,
  });
  if (new URL(request.url).searchParams.has("dl")) {
    headers.set("Content-Disposition", `attachment; filename="herebygrace-${id}.jpg"`);
  }
  return new Response(obj.body, { headers });
}
