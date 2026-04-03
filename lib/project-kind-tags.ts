/** Prisma `ProjectKindTag` 와 동일 문자열 — 클라이언트에서 Prisma 의존 최소화 */
export type ProjectKindTagValue = "TEAM" | "PERSONAL" | "IN_PROGRESS";

export const PROJECT_KIND_TAG_OPTIONS: {
  value: ProjectKindTagValue;
  label: string;
}[] = [
  { value: "TEAM", label: "Team" },
  { value: "PERSONAL", label: "Personal" },
  { value: "IN_PROGRESS", label: "In Progress" },
];

const LABEL_TO_VALUE = new Map(
  PROJECT_KIND_TAG_OPTIONS.map((o) => [o.label, o.value]),
);

export function statusChipLabelsToKindValues(
  labels: string[],
): ProjectKindTagValue[] {
  const out: ProjectKindTagValue[] = [];
  for (const l of labels) {
    const v = LABEL_TO_VALUE.get(l);
    if (v) out.push(v);
  }
  return [...new Set(out)];
}

export function kindValuesToStatusChipLabels(
  values: ProjectKindTagValue[],
): string[] {
  const map = new Map(
    PROJECT_KIND_TAG_OPTIONS.map((o) => [o.value, o.label]),
  );
  return values.map((v) => map.get(v)!).filter(Boolean);
}

export function isProjectKindTagValue(s: string): s is ProjectKindTagValue {
  return s === "TEAM" || s === "PERSONAL" || s === "IN_PROGRESS";
}
