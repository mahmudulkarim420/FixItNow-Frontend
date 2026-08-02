"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PremiumPreloader } from "@/components/ui/PremiumPreloader";
import { useAuth } from "@/components/auth/auth-provider";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    async function performLogout() {
      try {
        await logout();
        toast.success("Signed out successfully");
      } catch {
        toast.error("Signed out");
      } finally {
        router.push("/login");
        router.refresh();
      }
    }

    performLogout();
  }, [router, logout]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="flex flex-col items-center gap-4">
        <PremiumPreloader />
        <p className="text-sm font-medium text-stone-600">Signing out of FixItNow...</p>
      </div>
    </div>
  );
}
