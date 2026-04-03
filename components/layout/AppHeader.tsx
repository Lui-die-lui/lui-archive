import SiteHeader from "@/components/layout/SiteHeader";

/** 포트폴리오·관리자 화면 공통 상단 네비(세션 반영은 `SiteHeader` 내부). */
export default async function AppHeader() {
  return <SiteHeader />;
}
