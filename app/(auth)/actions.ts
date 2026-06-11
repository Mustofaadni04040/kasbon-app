"use server";

import { redirect } from "next/navigation";
import type { AuthActionState } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { authSchema } from "@/validations";

function getValidationState(
  formData: FormData,
  fallbackMessage: string,
): AuthActionState {
  const validatedFields = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      message: fallbackMessage,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return {
    status: "idle",
    message: null,
  };
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validationState = getValidationState(
    formData,
    "Cek lagi email dan password kamu.",
  );

  if (validationState.status === "error") {
    return validationState;
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: "error",
      message: "Login gagal. Pastikan email dan password sudah benar.",
    };
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validationState = getValidationState(
    formData,
    "Lengkapi form dulu sebelum daftar.",
  );

  if (validationState.status === "error") {
    return validationState;
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  console.log("error", error);
  console.log("data", data);

  if (error) {
    return {
      status: "error",
      message: "Daftar gagal. Coba pakai email lain atau cek konfigurasi auth.",
    };
  }

  if (data.session) {
    await supabase.auth.signOut();
    redirect("/login?registered=1");
  }

  return {
    status: "success",
    message:
      "Akun berhasil dibuat. Kalau email confirmation aktif, cek inbox kamu dulu.",
  };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
}
