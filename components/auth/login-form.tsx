"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ApiError, loginUser } from "@/lib/api";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { ROLE_HOME } from "@/lib/auth-constants";

import { useAuth } from "@/components/auth/auth-provider";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSessionUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

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

  return (
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
  );
}
