import { createHmac } from "crypto";
import {
  ADMIN_SESSION_MAX_AGE_SEC,
} from "@/lib/admin-session/constants";

/**
 * Node 런타임(API Route) 전용 — HMAC 서명 토큰 생성.
 * 검증은 Edge용 `verify.ts`와 쌍을 이룹니다.
 */
export function signAdminSession(secret: string): string {
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SEC;
  const payload = JSON.stringify({ exp, v: 1 as const });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(payloadB64).digest();
  const sigB64 = Buffer.from(sig).toString("base64url");
  return `${payloadB64}.${sigB64}`;
}
