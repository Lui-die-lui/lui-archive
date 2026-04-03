type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "p" | "h2";
  /**
   * `intro`: 라벨·제목·부제를 한 블록으로 쌓을 때 하단 여백 없음(부모 `gap`/`mt`로 간격 통일).
   * `default`: About 등 라벨 아래 콘텐츠와 간격용 `mb-8`.
   */
  variant?: "default" | "intro";
};

/** 섹션 상단 소형 라벨 타이포. */
export default function SectionLabel({
  children,
  className = "",
  id,
  as: Tag = "p",
  variant = "default",
}: SectionLabelProps) {
  const margin =
    variant === "intro" ? "mb-0" : "mb-8 md:mb-6";
  return (
    <Tag
      id={id}
      className={`${margin} text-[0.65rem] font-medium uppercase tracking-[0.22em] text-zinc-400 md:text-[0.58rem] md:tracking-[0.2em] ${className}`}
    >
      {children}
    </Tag>
  );
}
