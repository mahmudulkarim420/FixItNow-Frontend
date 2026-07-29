import Link from "next/link";

import { RegisterForm } from "@/app/(auth)/register/register-form";

export const metadata = {
  title: "Create account · FixItNow",
  description: "Create your FixItNow account.",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2 text-center">
        <span className="mx-auto mb-1 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Get started
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Create your account
        </h1>
        <p className="text-sm text-zinc-500">
          Join FixItNow to book or offer trusted home services.
        </p>
      </div>

      <RegisterForm />

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-black/10 pt-5 text-sm">
        <span className="text-zinc-500">Already have an account?</span>
        <Link
          href="/login"
          className="font-semibold text-amber-600 transition-colors hover:text-amber-700"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
