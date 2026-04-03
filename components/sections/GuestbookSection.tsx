import SectionLabel from "@/components/ui/SectionLabel";
import GuestbookPanel from "@/components/guestbook/GuestbookPanel";
import { guestbookEntries } from "@/data/guestbook";

export default function GuestbookSection() {
  return (
    <section aria-labelledby="guestbook-heading" className="bg-[#fafbfd]">
      <div className="site-container py-24 md:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <SectionLabel as="p" className="w-full text-center">
            GUESTBOOK
          </SectionLabel>
          <h1
            id="guestbook-heading"
            className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-900 md:text-[1.9rem]"
          >
            방명록
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 md:mt-2.5 md:text-sm">
            지나간 대화를 차분히 모아 둔 기록 공간입니다.
          </p>
          <div className="mt-10 w-full">
            <GuestbookPanel initialEntries={guestbookEntries} />
          </div>
        </div>
      </div>
    </section>
  );
}
