import GuestbookPanel from "@/components/guestbook/GuestbookPanel";
import { guestbookEntries } from "@/data/guestbook";

export default function GuestbookSection() {
  return (
    <section
      aria-labelledby="guestbook-heading"
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="site-container relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden pb-8 pt-3 md:pb-10 md:pt-4">
        <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col items-start text-left">
          <div className="shrink-0">
            <div className="flex w-full items-baseline gap-0">
              <p className="shrink-0 text-[0.65rem] font-medium uppercase tracking-[0.22em] leading-none text-zinc-400 md:text-[0.58rem] md:tracking-[0.2em]">
                GUESTBOOK
              </p>
              <span className="relative -top-px ml-1 h-px flex-1 bg-zinc-200/80" aria-hidden />
            </div>
            <h1
              id="guestbook-heading"
              className="mt-3 text-base font-semibold leading-tight tracking-tight text-zinc-900 md:text-[1.35rem] lg:text-[1.45rem]"
            >
              방명록
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-snug text-zinc-500 md:mt-1 md:text-[0.95rem]">
              방문한 흔적을 짧게 남겨주세요.
            </p>
          </div>
          <div className="mt-4 flex min-h-0 w-full flex-1 flex-col md:mt-5">
            <GuestbookPanel initialEntries={guestbookEntries} />
          </div>
        </div>
      </div>
    </section>
  );
}
