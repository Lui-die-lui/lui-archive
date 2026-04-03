"use client";

import { getFirebaseAuth } from "@/lib/firebase/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      const auth = getFirebaseAuth();
      if (auth?.currentUser) {
        await signOut(auth);
      }
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-zinc-200/90 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-900 disabled:opacity-50"
    >
      {loading ? "로그아웃 중…" : "로그아웃"}
    </button>
  );
}
