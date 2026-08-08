"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Mail, User, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ApiError, registerUser } from "@/lib/api";
import { useAuth } from "@/components/auth/auth-provider";
import { ROLE_HOME } from "@/lib/auth-constants";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();
  const { setSessionUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
      avatar: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image size must be under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      setAvatarPreview(base64Url);
      setValue("avatar", base64Url, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setValue("avatar", "", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: RegisterValues) => {
    setSubmitting(true);
    try {
      const user = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        avatar: values.avatar || undefined,
      });

      toast.success(`Account created! Welcome, ${user.name.split(" ")[0]}.`);

      try {
        const authedUser = await import("@/lib/api").then(({ loginUser }) =>
          loginUser({ email: values.email, password: values.password }),
        );
        setSessionUser(authedUser || user);
        router.push(ROLE_HOME[user.role]);
      } catch {
        setSessionUser(user);
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
      <div className="flex flex-col items-center justify-center gap-2 mb-2">
        <label className="text-xs font-bold text-stone-700 dark:text-white/80">Profile Picture (Optional)</label>
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-stone-200 bg-amber-50 flex items-center justify-center shadow-xs transition group-hover:border-amber-400">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Profile Preview"
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <User className="h-9 w-9 text-amber-700/60" />
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <Camera className="h-5 w-5" />
              <span className="text-[9px] font-bold mt-0.5">Upload</span>
            </div>
          </div>

          {avatarPreview && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveAvatar();
              }}
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition cursor-pointer"
              title="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <p className="text-[11px] text-stone-500 dark:text-white/80">
          Click circle to choose photo (Max 3MB)
        </p>
      </div>

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

      <Button type="submit" size="lg" isLoading={submitting} className="w-full">
        {submitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
