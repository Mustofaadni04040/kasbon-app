import type {
  Database,
  DebtCounterpartGroup,
  DebtListQuery,
  DebtRecord,
  DebtSummary,
} from "@/types";

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

export function calculateDebtSummary(items: DebtRecord[]): DebtSummary {
  const totalOwedToMe = items
    .filter((item) => item.type === "owed_to_me")
    .reduce((total, item) => total + item.amount, 0);

  const totalIOwe = items
    .filter((item) => item.type === "i_owe")
    .reduce((total, item) => total + item.amount, 0);

  return {
    totalOwedToMe,
    totalIOwe,
    net: totalOwedToMe - totalIOwe,
  };
}

export function groupDebtsByCounterpart(
  items: DebtRecord[],
): DebtCounterpartGroup[] {
  const groupedMap = new Map<string, DebtCounterpartGroup>();

  items.forEach((item) => {
    const key = item.counterpartName.trim().toLocaleLowerCase("id-ID");
    const existingGroup = groupedMap.get(key);

    if (existingGroup) {
      existingGroup.count += 1;
      existingGroup.totalAmount += item.amount;
      existingGroup.unsettledCount += item.settledAt ? 0 : 1;
      existingGroup.settledCount += item.settledAt ? 1 : 0;
      return;
    }

    groupedMap.set(key, {
      counterpartName: item.counterpartName,
      count: 1,
      totalAmount: item.amount,
      unsettledCount: item.settledAt ? 0 : 1,
      settledCount: item.settledAt ? 1 : 0,
    });
  });

  return Array.from(groupedMap.values())
    .filter((group) => group.count > 1)
    .sort((leftGroup, rightGroup) => rightGroup.totalAmount - leftGroup.totalAmount);
}
