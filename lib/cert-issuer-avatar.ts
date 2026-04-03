/** 발행원 문자열의 첫 글자(유니코드 스칼라 1개) — 아바타 표시용 */
export function issuerAvatarLetter(issuer: string): string {
  const t = issuer.trim();
  if (!t) return "?";
  const first = [...t][0];
  return first ?? "?";
}
