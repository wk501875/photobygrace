// /admin 아래 모든 주소는 ADMIN_PASSWORD 로 보호 (브라우저 로그인 창, 아이디는 아무거나)
import { safeEqual } from "../_lib.js";

export async function onRequest({ request, env, next }) {
  if (!env.ADMIN_PASSWORD) return new Response("ADMIN_PASSWORD가 설정되지 않았어요.", { status: 503 });
  const auth = request.headers.get("Authorization") || "";
  let pass = "";
  if (auth.startsWith("Basic ")) {
    try {
      const decoded = new TextDecoder().decode(Uint8Array.from(atob(auth.slice(6)), (c) => c.charCodeAt(0)));
      pass = decoded.slice(decoded.indexOf(":") + 1);
    } catch {}
  }
  if (!safeEqual(pass, env.ADMIN_PASSWORD)) {
    return new Response("관리자 비밀번호가 필요해요.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="photobygrace admin", charset="UTF-8"', "Cache-Control": "no-store" },
    });
  }
  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set("Cache-Control", "no-store");
  return out;
}
