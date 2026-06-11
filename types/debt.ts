export const debtTypes = ["debt_to_me", "i_owe"] as const;

export type DebtType = (typeof debtTypes)[number];

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
