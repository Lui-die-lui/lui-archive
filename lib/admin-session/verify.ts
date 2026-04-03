/**
 * Edge 미들웨어에서 사용 — Node 전용 모듈 없음.
 */

function base64UrlToBytes(s: string): Uint8Array {
  let base64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad === 2) base64 += "==";
  else if (pad === 3) base64 += "=";
  else if (pad === 1) throw new Error("invalid base64url");
  const bin = atob(base64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function verifyAdminSession(
  token: string,
  secret: string,
): Promise<boolean> {
  if (!secret || !token) return false;

  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return false;
  const payloadB64 = token.slice(0, lastDot);
  const sigB64 = token.slice(lastDot + 1);
  if (!payloadB64 || !sigB64) return false;

  const enc = new TextEncoder();
  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
  } catch {
    return false;
  }

  let sigBytes: Uint8Array;
  try {
    sigBytes = base64UrlToBytes(sigB64);
  } catch {
    return false;
  }

  const signature = new Uint8Array(sigBytes);

  let ok: boolean;
  try {
    ok = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      enc.encode(payloadB64),
    );
  } catch {
    return false;
  }
  if (!ok) return false;

  let exp: number;
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(payloadB64));
    const p = JSON.parse(json) as { exp?: number; v?: number };
    if (typeof p.exp !== "number") return false;
    exp = p.exp;
  } catch {
    return false;
  }

  return exp >= Math.floor(Date.now() / 1000);
}
