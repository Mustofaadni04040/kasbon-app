import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { signUpAction } from "@/app/(auth)/actions";
import { getCurrentUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <AuthForm mode="signup" action={signUpAction} />;
}
