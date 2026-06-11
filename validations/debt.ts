import { z } from "zod";
import {
  debtSortOptions,
  debtStatusFilters,
  debtTypeFilters,
  debtTypes,
} from "@/types";

export const MAX_NOTE_LENGTH = 200;

const counterpartNameSchema = z
  .string()
  .trim()
  .min(1, "Counterpart name is required.");

const amountSchema = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.trim() !== "") {
      return Number(value);
    }

    return value;
  },
  z
    .number({
      error: "Amount must be a number.",
    })
    .int("Amount must be an integer.")
    .positive("Amount must be greater than zero."),
);

const noteSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== "string") {
      return value;
    }

    const normalizedValue = value.trim();
    return normalizedValue === "" ? null : normalizedValue;
  },
  z
    .string()
    .max(MAX_NOTE_LENGTH, "Note must be 200 characters or less.")
    .nullable(),
);

const dueDateSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== "string") {
      return value;
    }

    const normalizedValue = value.trim();
    return normalizedValue === "" ? null : normalizedValue;
  },
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must use YYYY-MM-DD format.")
    .nullable(),
);

export const debtListQuerySchema = z.object({
  status: z.enum(debtStatusFilters).default("all"),
  type: z.enum(debtTypeFilters).default("all"),
  search: z.string().trim().default(""),
  sort: z.enum(debtSortOptions).default("newest"),
});

export const createDebtSchema = z.object({
  type: z.enum(debtTypes),
  counterpartName: counterpartNameSchema,
  amount: amountSchema,
  note: noteSchema.optional().default(null),
  dueDate: dueDateSchema.optional().default(null),
});

export const updateDebtSchema = z
  .object({
    type: z.enum(debtTypes).optional(),
    counterpartName: counterpartNameSchema.optional(),
    amount: amountSchema.optional(),
    note: noteSchema.optional(),
    dueDate: dueDateSchema.optional(),
    settled: z.boolean().optional(),
  })
  .refine(
    (value) => Object.values(value).some((fieldValue) => fieldValue !== undefined),
    {
      message: "Request body must include at least one field to update.",
    },
  );

export const debtIdParamSchema = z.object({
  id: z.string().uuid("Debt id must be a valid UUID."),
});
