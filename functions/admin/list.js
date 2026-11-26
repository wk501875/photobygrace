// GET /admin/list — 저장된 사진 전체 목록 (최신순)
import { json } from "../_lib.js";

export async function onRequestGet({ env }) {
  if (!env.PHOTOS) return json({ ok: false, error: "R2 버킷(PHOTOS)이 연결되지 않았어요." }, 500);
  const items = [];
  let cursor;
  do {
    const res = await env.PHOTOS.list({ prefix: "p/", cursor, limit: 1000, include: ["customMetadata"] });
    for (const o of res.objects) {
      items.push({ id: o.key.slice(2, -4), size: o.size, created: (o.customMetadata && o.customMetadata.created) || o.uploaded });
    }
    cursor = res.truncated ? res.cursor : undefined;
  } while (cursor);
  items.reverse();
  return json({ ok: true, count: items.length, bytes: items.reduce((s, o) => s + o.size, 0), items });
}
