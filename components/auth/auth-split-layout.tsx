"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

export function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRegister = pathname?.includes("/register");

  return (
    <div
      className={`flex min-h-screen w-full bg-[#F9F7F2] dark:bg-slate-950 transition-colors duration-200 ${
        isRegister ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      {/* Branded illustration panel */}
      <AuthBrandPanel />

      {/* Authentication form container */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:w-1/2 lg:px-12 lg:py-12 xl:px-20">
        <div className="auth-form-card w-full max-w-lg">
          {/* Mobile header logo */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center justify-center gap-2.5 text-stone-900 dark:text-slate-100 lg:hidden group"
          >
            <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs">
              <Image
                src="/logo.png"
                alt="FixItNow Logo"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100">
              FixItNow<span className="text-amber-500 font-extrabold">.</span>
            </span>
          </Link>

          <div className="px-1 py-2 sm:px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
