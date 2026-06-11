import type { Database, DebtListQuery, DebtRecord } from "@/types";

type DebtRow = Database["public"]["Tables"]["debts"]["Row"];

export function mapDebtRow(row: DebtRow): DebtRecord {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    counterpartName: row.counterpart_name,
    amount: row.amount,
    note: row.note,
    dueDate: row.due_date,
    settledAt: row.settled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function applyDebtListSort<
  TQuery extends {
    order: (
      column: keyof DebtRow,
      options?: { ascending?: boolean },
    ) => TQuery;
  },
>(query: TQuery, sort: DebtListQuery["sort"]): TQuery {
  switch (sort) {
    case "oldest":
      return query.order("created_at", { ascending: true });
    case "amount_high":
      return query
        .order("amount", { ascending: false })
        .order("created_at", { ascending: false });
    case "amount_low":
      return query
        .order("amount", { ascending: true })
        .order("created_at", { ascending: false });
    case "newest":
    default:
      return query.order("created_at", { ascending: false });
  }
}
