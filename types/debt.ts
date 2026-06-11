export const debtTypes = ["owed_to_me", "i_owe"] as const;
export const debtStatusFilters = ["all", "unsettled", "settled"] as const;
export const debtTypeFilters = ["all", "owed_to_me", "i_owe"] as const;
export const debtSortOptions = [
  "newest",
  "oldest",
  "amount_high",
  "amount_low",
] as const;

export type DebtType = (typeof debtTypes)[number];
export type DebtStatusFilter = (typeof debtStatusFilters)[number];
export type DebtTypeFilter = (typeof debtTypeFilters)[number];
export type DebtSortOption = (typeof debtSortOptions)[number];

export interface DebtRecord {
  id: string;
  userId: string;
  type: DebtType;
  counterpartName: string;
  amount: number;
  note: string | null;
  dueDate: string | null;
  settledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DebtListQuery {
  status: DebtStatusFilter;
  type: DebtTypeFilter;
  search: string;
  sort: DebtSortOption;
}
