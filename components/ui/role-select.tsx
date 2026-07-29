"use client";

import { UserRound, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

export type RegisterRole = "CUSTOMER" | "TECHNICIAN";

interface RoleOption {
  value: RegisterRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const OPTIONS: RoleOption[] = [
  {
    value: "CUSTOMER",
    label: "Customer",
    description: "Book and pay for services",
    icon: <UserRound className="h-5 w-5" />,
  },
  {
    value: "TECHNICIAN",
    label: "Technician",
    description: "Offer services & manage bookings",
    icon: <Wrench className="h-5 w-5" />,
  },
];

export interface RoleSelectProps {
  value: RegisterRole | "";
  onChange: (value: RegisterRole) => void;
  error?: string;
}

export function RoleSelect({ value, onChange, error }: RoleSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-700">I am a...</span>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cn(
                "flex min-h-32 flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all duration-200 sm:p-4",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/20",
                active
                  ? "border-amber-500 bg-amber-50 ring-2 ring-amber-500/30"
                  : "border-black/10 bg-white/60 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50/40",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  active
                    ? "bg-amber-500 text-white"
                    : "bg-zinc-100 text-zinc-500",
                )}
              >
                {option.icon}
              </span>
              <span className="text-sm font-semibold text-zinc-900">
                {option.label}
              </span>
              <span className="text-xs text-zinc-500">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
