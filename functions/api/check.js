// POST /api/check — 시작화면에서 운영(행사) 코드를 넣을 때 맞는지 확인만 함 (저장·업로드 없음)
import { json, safeEqual } from "../_lib.js";

export async function onRequestPost({ request, env }) {
  if (!env.EVENT_CODE) return json({ ok: false, error: "EVENT_CODE가 설정되지 않았어요." }, 500);
  if (safeEqual(request.headers.get("X-Event-Code"), env.EVENT_CODE)) return json({ ok: true });
  await new Promise(r => setTimeout(r, 600));   // 마구 넣어 보기 늦추기
  return json({ ok: false, error: "운영 코드가 맞지 않아요." }, 401);
}
