import { debtTypes, type DebtType } from "@/types";

export const MAX_NOTE_LENGTH = 200;

export function isDebtType(value: string): value is DebtType {
  return debtTypes.includes(value as DebtType);
}

export function isPositiveAmount(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function isValidNote(note: string): boolean {
  return note.trim().length <= MAX_NOTE_LENGTH;
}

export function isRequiredCounterpartName(value: string): boolean {
  return value.trim().length > 0;
}
