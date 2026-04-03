"use client";

import { useEffect } from "react";

const HEADER_OFFSET_PX = 72;

export default function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const id = hash.slice(1);
    let attempts = 0;

    const tick = () => {
      const el = document.getElementById(id);
      if (!el) {
        attempts += 1;
        if (attempts <= 6) window.setTimeout(tick, 50);
        return;
      }

      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
      window.scrollTo({ top, behavior: "auto" });
    };

    tick();
  }, []);

  return null;
}

