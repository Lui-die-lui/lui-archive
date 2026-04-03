/** 푸터·연락용 링크(mock). 실제 값으로 교체하세요. */
export const contact = {
  email: "Email",
  // Gmail 새 메일 작성 화면(view=cm)으로 이동
  emailHref:
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent("lsg960528@gmail.com")}` +
    `&su=${encodeURIComponent("포트폴리오 문의")}` +
    `&body=${encodeURIComponent("안녕하세요. 포트폴리오를 보고 연락드립니다.")}`,
  github: {
    href: "https://github.com/Lui-die-lui",
    label: "GitHub",
  },
  velog: {
    href: "https://velog.io/@luislki_",
    label: "Velog",
  },
  instagram: { href: "https://www.instagram.com/hybridlife.lui?igsh=MWswMjk1YXMyaTl0bQ%3D%3D&utm_source=qr", label: "Instagram" },
} as const;
