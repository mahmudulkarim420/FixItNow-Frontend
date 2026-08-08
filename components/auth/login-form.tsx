"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

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

interface DemoAccount {
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  label: string;
  badge: string;
  email: string;
  password: string;
  icon: React.ElementType;
  badgeColor: string;
  description: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "CUSTOMER",
    label: "Demo Customer",
    badge: "Customer",
    email: "customer@gmail.com",
    password: "password123",
    icon: User,
    badgeColor:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    description: "Book repairs & track visits",
  },
  {
    role: "TECHNICIAN",
    label: "Demo Technician",
    badge: "Provider",
    email: "technician@gmail.com",
    password: "password123",
    icon: Wrench,
    badgeColor:
      "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    description: "Job requests & offerings",
  },
  {
    role: "ADMIN",
    label: "Demo Admin",
    badge: "Admin",
    email: "admin@gmail.com",
    password: "password123",
    icon: ShieldCheck,
    badgeColor:
      "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
    description: "Analytics & moderation",
  },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSessionUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState<string | null>(null);

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
    setValue,
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

  const handleDemoLogin = async (account: DemoAccount) => {
    if (submitting || activeDemoRole) return;

    setActiveDemoRole(account.role);
    setValue("email", account.email, { shouldValidate: true });
    setValue("password", account.password, { shouldValidate: true });

    try {
      const user = await loginUser({
        email: account.email,
        password: account.password,
      });

      setSessionUser(user);
      toast.success(`Logged in as ${account.label} (${user.name})`);

      const redirectTarget = searchParams.get("redirect");
      const destination =
        redirectTarget ?? ROLE_HOME[user.role];

      router.push(destination);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 403) {
          toast.error("This demo account is currently banned.");
        } else if (error.statusCode === 404) {
          toast.error("Demo account not found in database. Please run seed.");
        } else {
          toast.error(error.message || "Demo login failed. Please try again.");
        }
      } else {
        toast.error("Demo login failed. Please try again.");
      }
      setActiveDemoRole(null);
    }
  };

  const isAnyLoading = submitting || googleLoading || Boolean(activeDemoRole);

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Google OAuth Login Button */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleGoogleLogin}
        isLoading={googleLoading}
        disabled={isAnyLoading}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-zinc-900 dark:text-zinc-100 font-medium border border-black/10 dark:border-slate-800 shadow-2xs cursor-pointer"
      >
        <GoogleIcon className="h-5 w-5 shrink-0" />
        <span>Continue with Google</span>
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-0.5">
        <div className="w-full border-t border-black/10 dark:border-white/10" />
        <span className="absolute bg-white px-3 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:bg-slate-900 dark:text-zinc-500">
          or sign in with email
        </span>
      </div>

      {/* 2. Standard Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          disabled={isAnyLoading}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          disabled={isAnyLoading}
          {...register("password")}
        />

        <Button
          type="submit"
          size="lg"
          isLoading={submitting && !activeDemoRole}
          disabled={isAnyLoading}
          className="w-full cursor-pointer"
        >
          {submitting && !activeDemoRole ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* 3. Demo Quick Login Section */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="relative flex items-center justify-center my-1">
          <div className="w-full border-t border-black/10 dark:border-white/10" />
          <span className="absolute bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:bg-slate-900 dark:text-amber-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Demo Quick Login</span>
          </span>
        </div>

        <p className="text-center text-xs text-zinc-500 dark:text-slate-400">
          Select a test account below to sign in instantly with demo credentials:
        </p>

        {/* Role-Based Demo Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {DEMO_ACCOUNTS.map((account) => {
            const Icon = account.icon;
            const isThisLoggingIn = activeDemoRole === account.role;

            return (
              <button
                key={account.role}
                type="button"
                onClick={() => handleDemoLogin(account)}
                disabled={isAnyLoading}
                className={cn(
                  "group relative flex flex-col items-start justify-between rounded-2xl border p-3 text-left transition-all duration-200",
                  "border-stone-200/90 dark:border-slate-800 bg-stone-50/80 dark:bg-slate-800/80",
                  "hover:border-amber-400 hover:bg-amber-50/50 dark:hover:border-amber-500/50 dark:hover:bg-slate-800 shadow-2xs hover:shadow-sm",
                  "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]",
                  isThisLoggingIn &&
                    "border-amber-500 bg-amber-50/90 dark:bg-amber-950/40 ring-2 ring-amber-500/30"
                )}
                aria-label={`Login as ${account.label}`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-stone-800 dark:text-slate-200 border border-stone-200/60 dark:border-slate-700 shadow-2xs group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {isThisLoggingIn ? (
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[9px] font-extrabold",
                      account.badgeColor
                    )}
                  >
                    {account.badge}
                  </span>
                </div>

                <div className="w-full">
                  <div className="text-xs font-bold text-stone-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 flex items-center justify-between w-full">
                    <span>{account.label}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-600 dark:text-amber-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {isThisLoggingIn ? "Signing in..." : account.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Demo Password Indicator */}
        <div className="rounded-xl border border-stone-200/60 dark:border-slate-800/80 bg-stone-50/60 dark:bg-slate-800/40 px-3 py-2 text-[11px] text-stone-500 dark:text-slate-400 flex items-center justify-between">
          <span>Password for all demo accounts:</span>
          <code className="rounded bg-stone-200/70 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] font-bold text-stone-800 dark:text-slate-200">
            password123
          </code>
        </div>
      </div>
    </div>
  );
}

