"use client";

import {
  completeAdminRedirectLoginIfPresent,
  signInAdmin,
  signInAdminRedirect,
} from "@/lib/firebase/sign-in-admin";
import { isFirebaseAuthConfigured } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  /** 로그인 성공 후 이동 경로 힌트(쿼리 `from` 원문, 서버에서 한 번 더 검증됨) */
  fromPath?: string;
};

export default function AdminLoginForm({ fromPath }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirectCompleting, setRedirectCompleting] = useState(true);

  const clientReady = isFirebaseAuthConfigured();

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!clientReady) {
        setRedirectCompleting(false);
        return;
      }
      try {
        const done = await completeAdminRedirectLoginIfPresent();
        if (!alive) return;
        if (done) {
          router.replace(done.redirectTo);
          router.refresh();
          return;
        }
      } catch (e) {
        if (alive) {
          setError(e instanceof Error ? e.message : "로그인에 실패했습니다.");
        }
      } finally {
        if (alive) setRedirectCompleting(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [clientReady, router]);

  async function handleGoogleSignInPopup() {
    setError(null);
    setLoading(true);
    try {
      const { redirectTo } = await signInAdmin(fromPath);
      router.replace(redirectTo);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignInRedirect() {
    setError(null);
    setLoading(true);
    try {
      await signInAdminRedirect(fromPath);
    } catch (e) {
      setError(e instanceof Error ? e.message : "로그인에 실패했습니다.");
      setLoading(false);
    }
  }

  const busy = loading || redirectCompleting;

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      {!clientReady ? (
        <p
          className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-sm text-amber-950"
          role="status"
        >
          클라이언트용 Firebase 설정이 필요합니다.{" "}
          <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">
            NEXT_PUBLIC_FIREBASE_API_KEY
          </code>
          ,{" "}
          <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
          </code>{" "}
          등을 확인해 주세요.
        </p>
      ) : null}

      {redirectCompleting && clientReady ? (
        <p className="text-center text-sm text-zinc-500" role="status">
          로그인 상태 확인 중…
        </p>
      ) : null}

      {error ? (
        <p
          className="rounded-lg border border-rose-200/80 bg-rose-50/90 px-3 py-2 text-sm text-rose-900"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => void handleGoogleSignInPopup()}
          disabled={busy || !clientReady}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
        >
          <GoogleMark className="h-5 w-5 shrink-0" aria-hidden />
          {loading && !redirectCompleting ? "로그인 중…" : "Google로 로그인 (팝업)"}
        </button>
        <button
          type="button"
          onClick={() => void handleGoogleSignInRedirect()}
          disabled={busy || !clientReady}
          className="w-full rounded-xl border border-zinc-200/60 bg-zinc-50/90 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-50"
        >
          같은 창에서 로그인 (팝업이 안 될 때)
        </button>
      </div>

      <p className="text-center text-[11px] leading-relaxed text-zinc-400">
        허용된 관리자 이메일과 일치하는 Google 계정만 통과합니다. 하얀 창만
        잠깐 뜨고 닫히면 위 안내 또는 Firebase 콘솔「승인된 도메인」을 확인해
        주세요.
      </p>
    </div>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
