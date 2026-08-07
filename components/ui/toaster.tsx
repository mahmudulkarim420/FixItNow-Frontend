"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/components/theme/theme-provider";

/**
 * App-wide toast provider. Mounted once in the root layout.
 * Styled to match the FixItNow cream/amber theme in light and dark modes.
 */
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!bg-white/90 dark:!bg-slate-900/90 !backdrop-blur-md !border !border-stone-200/80 dark:!border-slate-800 !text-stone-900 dark:!text-slate-100 !shadow-lg",
        },
      }}
    />
  );
}
