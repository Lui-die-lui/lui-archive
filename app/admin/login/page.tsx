import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-session/constants";
import { safeAdminPathAfterLogin } from "@/lib/admin-session/safe-redirect";
import { verifyAdminSession } from "@/lib/admin-session/verify";
import { isFirebaseAdminSdkConfigured } from "@/lib/firebase/admin-server";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) {
    const store = await cookies();
    const token = store.get(ADMIN_COOKIE_NAME)?.value;
    if (token && (await verifyAdminSession(token, secret))) {
      const raw = params.from;
      const from = Array.isArray(raw) ? raw[0] : raw;
      redirect(safeAdminPathAfterLogin(from));
    }
  }

  const raw = params.from;
  const fromPath = Array.isArray(raw) ? raw[0] : raw;

  const authConfigured =
    Boolean(process.env.ADMIN_SESSION_SECRET) &&
    Boolean(process.env.ADMIN_EMAIL?.trim()) &&
    isFirebaseAdminSdkConfigured();

  return (
    <div className="mx-auto max-w-lg">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-zinc-400">
        Admin
      </p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
        관리자 인증
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
        Google 계정으로 로그인합니다. 서버에 등록된 관리자 이메일과 일치할 때만
        관리 화면으로 이동합니다. 일반 방문자용 로그인이 아닙니다.
      </p>

      {!authConfigured ? (
        <p
          className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-sm text-amber-950"
          role="status"
        >
          로컬에서 시도 중이라면 `.env`에{" "}
          <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">
            ADMIN_EMAIL
          </code>
          ,{" "}
          <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">
            ADMIN_SESSION_SECRET
          </code>
          , Firebase Admin 서비스 계정(
          <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">
            FIREBASE_ADMIN_*
          </code>
          )와 클라이언트용{" "}
          <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">
            NEXT_PUBLIC_FIREBASE_*
          </code>
          를 설정해 주세요. 자세한 목록은{" "}
          <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">
            .env.example
          </code>
          을 참고하세요.
        </p>
      ) : null}

      <div className="mt-10 rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-[0_8px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm md:p-8">
        <AdminLoginForm fromPath={fromPath} />
      </div>
    </div>
  );
}
