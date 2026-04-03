import Link from "next/link";
import AdminDashboardPanel from "@/components/admin/AdminDashboardPanel";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { getAdminDashboardStats } from "@/lib/dashboard-stats";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  let stats;
  try {
    stats = await getAdminDashboardStats();
  } catch (e) {
    console.error("[admin dashboard]", e);
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-zinc-400">
              Dashboard
            </p>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
              관리자
            </h1>
          </div>
          <AdminLogoutButton />
        </div>
        <p
          className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          통계를 불러오지 못했습니다. <code className="font-mono text-xs">DATABASE_URL</code>과{" "}
          <code className="font-mono text-xs">SiteVisit</code> 테이블(db push)을 확인해 주세요.
        </p>
        <p className="mt-8 text-sm">
          <Link
            href="/"
            className="text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-800 hover:underline"
          >
            포트폴리오로 돌아가기
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-zinc-400">
            Dashboard
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
            관리자
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            방문·방명록 요약과 수신 ON/OFF를 여기서 조정할 수 있습니다.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminDashboardPanel data={stats} />

    </div>
  );
}
