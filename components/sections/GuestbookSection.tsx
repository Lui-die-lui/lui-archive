import GuestbookPanel from "@/components/guestbook/GuestbookPanel";
import type { GuestbookEntry } from "@/data/guestbook";
import { isAdminSession } from "@/lib/admin-auth";
import { guestbookRowToEntry } from "@/lib/guestbook-db";
import { prisma } from "@/lib/prisma";

export default async function GuestbookSection() {
  const isAdmin = await isAdminSession();
  let initialEntries: GuestbookEntry[] = [];
  let submissionsOpen = true;
  let loadError: string | null = null;

  try {
    const [settings, rows] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 1 } }),
      prisma.guestbookEntry.findMany({
        orderBy: { createdAt: "asc" },
      }),
    ]);
    submissionsOpen = settings?.guestbookSubmissionsOpen ?? true;
    initialEntries = rows.map(guestbookRowToEntry);
  } catch (e) {
    console.error("[GuestbookSection]", e);
    loadError =
      "방명록 데이터를 불러오지 못했습니다. DATABASE_URL과 DB 상태를 확인해 주세요.";
  }

  return (
    <section
      aria-labelledby="guestbook-heading"
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="site-container relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden pb-8 pt-3 md:pb-10 md:pt-4">
        <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col text-left">
          <GuestbookPanel
            initialEntries={initialEntries}
            submissionsOpen={submissionsOpen}
            loadError={loadError}
            isAdminSession={isAdmin}
          />
        </div>
      </div>
    </section>
  );
}
