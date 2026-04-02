/** About GitHub contribution 카드용 요약 타입 (서버 가공 결과·프롭 공유) */
export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionSummary = {
  thisYear: number;
  today: number;
  days: ContributionDay[];
};
