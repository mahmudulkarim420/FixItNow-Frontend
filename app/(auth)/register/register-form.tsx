"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { RoleSelect, type RegisterRole } from "@/components/ui/role-select";
import { ApiError, registerUser } from "@/lib/api";
import { ROLE_HOME } from "@/lib/auth-constants";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
  });

  // useWatch is React Compiler-friendly (watch() is not memoizable).
  const selectedRole = useWatch({ control, name: "role" });

  const onSubmit = async (values: RegisterValues) => {
    setSubmitting(true);
    try {
      const user = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      toast.success(`Account created! Welcome, ${user.name.split(" ")[0]}.`);

      // Auto-login after registration by calling login endpoint.
      try {
        await import("@/lib/api").then(({ loginUser }) =>
          loginUser({ email: values.email, password: values.password }),
        );
        router.push(ROLE_HOME[user.role]);
      } catch {
        router.push("/login");
      }
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 409) {
          toast.error("An account with this email already exists.");
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
        label="Full name"
        placeholder="John Doe"
        autoComplete="name"
        leftIcon={<User className="h-4 w-4" />}
        error={errors.name?.message}
        {...register("name")}
      />

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
        placeholder="At least 6 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        hint="Use 6+ characters with a letter and a number."
        {...register("password")}
      />

      <PasswordInput
        label="Confirm password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <RoleSelect
        value={selectedRole}
        onChange={(role: RegisterRole) =>
          setValue("role", role, { shouldValidate: true })
        }
        error={errors.role?.message}
      />

      <Button type="submit" size="lg" isLoading={submitting} className="w-full">
        {submitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
