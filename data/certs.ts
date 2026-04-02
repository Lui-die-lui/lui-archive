export type Cert = {
  id: string;
  title: string;
  issuer: string;
  /** 화면 표기용 날짜 문자열 */
  issuedAt: string;
  /** 있으면 카드 전체가 링크로 동작 */
  url: string | null;
  /** 공개 링크가 없는 항목(SQLD 등) 구분용 */
  hasPublicLink: boolean;
};

export const certs: Cert[] = [
  {
    id: "aws-ccp",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issuedAt: "2024.06",
    url: "https://aws.amazon.com/certification/",
    hasPublicLink: true,
  },
  {
    id: "sqld",
    title: "SQLD",
    issuer: "한국데이터산업진흥원",
    issuedAt: "2023.11",
    url: null,
    hasPublicLink: false,
  },
  {
    id: "engineer-info",
    title: "정보처리기사",
    issuer: "한국산업인력공단",
    issuedAt: "2022.05",
    url: "https://www.q-net.or.kr/",
    hasPublicLink: true,
  },
];
