type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "p" | "h2";
};

/** 섹션 상단 소형 라벨 타이포. */
export default function SectionLabel({
  children,
  className = "",
  id,
  as: Tag = "p",
}: SectionLabelProps) {
  return (
    <Tag
      id={id}
      className={`mb-8 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-zinc-400 md:mb-6 md:text-[0.58rem] md:tracking-[0.2em] ${className}`}
    >
      {children}
    </Tag>
  );
}
