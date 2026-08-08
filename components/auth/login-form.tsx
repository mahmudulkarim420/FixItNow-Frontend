"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ApiError, loginUser } from "@/lib/api";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { ROLE_HOME } from "@/lib/auth-constants";

import { useAuth } from "@/components/auth/auth-provider";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.39 7.37 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.26A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.61 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSessionUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "account_banned") {
      toast.error("Your account has been banned. Contact support.");
    } else if (error === "google_auth_failed") {
      toast.error("Google authentication failed. Please try again.");
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      const user = await loginUser(values);
      setSessionUser(user);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);

      const redirectTarget = searchParams.get("redirect");
      const destination =
        redirectTarget ?? ROLE_HOME[user.role];

      router.push(destination);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 403) {
          toast.error("Your account has been banned. Contact support.");
        } else if (error.statusCode === 404) {
          toast.error("No account found with that email.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const redirectTarget = searchParams.get("redirect");
    const redirectQuery = redirectTarget
      ? `?redirect=${encodeURIComponent(redirectTarget)}`
      : "";
    window.location.href = `/api/auth/google${redirectQuery}`;
  };

  return (
    <div className="flex flex-col gap-5">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleGoogleLogin}
        isLoading={googleLoading}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-zinc-900 dark:text-zinc-100 font-medium border border-black/10 dark:border-slate-800 shadow-2xs"
      >
        <GoogleIcon className="h-5 w-5 shrink-0" />
        <span>Continue with Google</span>
      </Button>

      <div className="relative flex items-center justify-center my-0.5">
        <div className="w-full border-t border-black/10 dark:border-white/10" />
        <span className="absolute bg-white px-3 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:bg-slate-900 dark:text-zinc-500">
          or sign in with email
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" size="lg" isLoading={submitting} className="w-full">
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
