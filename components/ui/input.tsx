import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            className={cn(
              "h-12 w-full rounded-xl border bg-white/70 dark:bg-slate-900/80 px-3.5 text-sm text-zinc-900 dark:text-slate-100 placeholder:text-zinc-400 dark:placeholder:text-slate-500 shadow-2xs shadow-black/[0.03]",
              "transition-[border-color,box-shadow,background-color] duration-200",
              "focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500",
              leftIcon && "pl-10",
              rightIcon && "pr-11",
              error
                ? "border-red-400 dark:border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
                : "border-black/10 dark:border-slate-700",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
        ) : hint ? (
          <p className="text-xs text-zinc-500 dark:text-slate-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
