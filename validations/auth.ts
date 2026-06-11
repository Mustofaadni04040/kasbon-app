import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .email("Format email belum valid."),
  password: z
    .string()
    .trim()
    .min(8, "Password minimal 8 karakter."),
});
