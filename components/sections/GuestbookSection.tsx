import GuestbookPanel from "@/components/guestbook/GuestbookPanel";
import { guestbookEntries } from "@/data/guestbook";

export default function GuestbookSection() {
  return (
    <section
      id="guestbook"
      aria-labelledby="guestbook-heading"
      className="border-b border-zinc-200/80 bg-white"
    >
      <div className="site-container py-24 md:py-32">
        <h2
          id="guestbook-heading"
          className="text-lg font-medium tracking-tight text-zinc-900"
        >
          방명록
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
          지나간 대화를 차분히 모아 둔 로그처럼 남겨 두는 공간입니다.
        </p>
        <div className="mt-10">
          <GuestbookPanel initialEntries={guestbookEntries} />
        </div>
      </div>
    </section>
  );
}
