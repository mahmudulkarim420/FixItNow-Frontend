"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * App-wide toast provider. Mounted once in the root layout.
 * Styled to match the FixItNow cream/amber theme.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!bg-white/90 !backdrop-blur-md !border !border-black/5 !text-zinc-900 !shadow-lg",
        },
      }}
    />
  );
}
