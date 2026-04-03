import { type CertAvatarVariant as PrismaCertAvatar } from "@prisma/client";
import type { Cert } from "@/data/certs";
import { certs as staticCerts } from "@/data/certs";
import { prisma } from "@/lib/prisma";

const VARIANT_TO_UI: Record<PrismaCertAvatar, Cert["avatarVariant"]> = {
  HAN: "han",
  GOOGLE: "google",
  ANTHROPIC: "anthropic",
};

function mapRow(row: {
  id: string;
  title: string;
  issuer: string;
  issuedAtLabel: string;
  url: string | null;
  hasPublicLink: boolean;
  avatarText: string;
  avatarVariant: PrismaCertAvatar;
}): Cert {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    issuedAt: row.issuedAtLabel,
    url: row.url,
    hasPublicLink: row.hasPublicLink,
    avatarText: row.avatarText,
    avatarVariant: VARIANT_TO_UI[row.avatarVariant],
  };
}

export type CertsHomePayload = {
  certs: Cert[];
  /** DB 행이 있는 자격증 id(cuid). 정적 mock만 쓸 때는 비어 있음 */
  persistedCertIds: Set<string>;
};

/** 홈 Certs 섹션용. DB 비어 있거나 오류 시 정적 목록. */
export async function getCertsForHome(): Promise<CertsHomePayload> {
  try {
    const rows = await prisma.certification.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) {
      return { certs: staticCerts, persistedCertIds: new Set() };
    }
    return {
      certs: rows.map(mapRow),
      persistedCertIds: new Set(rows.map((r) => r.id)),
    };
  } catch (e) {
    console.error("[certs] DB 로드 실패, 정적 데이터 사용", e);
    return { certs: staticCerts, persistedCertIds: new Set() };
  }
}
