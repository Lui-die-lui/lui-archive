import { contact } from "@/data/contact";
import { AiOutlineMail, AiOutlineInstagram } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";
import { SiVelog } from "react-icons/si";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-zinc-200/80 bg-[#f0f7ff]"
      aria-labelledby="footer-heading"
    >
      <div className="site-container py-12 md:py-16">
        <h2 id="footer-heading" className="sr-only">
          Contact
        </h2>

        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-600">
            <span className="font-medium text-zinc-700">Lui Archive</span>
            <span className="text-zinc-400"> · 2026</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm md:justify-end">
            <a
              href={contact.emailHref}
              className="group flex items-center gap-2.5 text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <AiOutlineMail className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-zinc-800" />
              <span className="break-all transition-colors group-hover:text-zinc-800">
                {contact.email}
              </span>
            </a>

            <a
              href={contact.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <FaGithub className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-zinc-800" />
              <span className="transition-colors group-hover:text-zinc-800">
                {contact.github.label}
              </span>
            </a>

            <a
              href={contact.velog.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <SiVelog className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-zinc-800" />
              <span className="transition-colors group-hover:text-zinc-800">
                {contact.velog.label}
              </span>
            </a>

            <a
              href={contact.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-zinc-600 transition-colors hover:text-zinc-900"
            >
              <AiOutlineInstagram className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-zinc-800" />
              <span className="transition-colors group-hover:text-zinc-800">
                {contact.instagram.label}
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
