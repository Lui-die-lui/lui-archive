import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-[70vh] bg-[#fafbfd] pt-12 text-zinc-900 md:pt-14 lg:pt-[3.75rem]">
      <div className="site-container py-10 md:py-14">{children}</div>
    </div>
  );
}
