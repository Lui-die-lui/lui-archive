import { contact } from "@/data/contact";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-zinc-200/80 bg-[#fafbfd]"
      aria-labelledby="footer-heading"
    >
      <div className="site-container py-14 md:py-16">
        <h2
          id="footer-heading"
          className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-400"
        >
          Contact
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          <a
            href={contact.emailHref}
            className="text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-500"
          >
            {contact.email}
          </a>
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
          <li>
            <a
              href={contact.github.href}
              className="transition-colors hover:text-zinc-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {contact.github.label}
            </a>
          </li>
          <li>
            <a
              href={contact.velog.href}
              className="transition-colors hover:text-zinc-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {contact.velog.label}
            </a>
          </li>
          <li>
            <a
              href={contact.instagram.href}
              className="transition-colors hover:text-zinc-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {contact.instagram.label}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
