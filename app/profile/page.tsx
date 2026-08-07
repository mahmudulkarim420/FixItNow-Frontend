import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer-section";
import { ProfileLayout } from "@/components/profile/profile-layout";
import { getTechnicianProfile } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import type { TechnicianProfile } from "@/types";

export const metadata = {
  title: "My Profile · FixItNow",
  description: "Manage your personal profile, credentials, and settings on FixItNow.",
};

export default async function ProfilePage() {
  const user = await requireUser();

  let technicianDetails: TechnicianProfile | null = null;
  if (user.role === "TECHNICIAN" && user.technicianProfile?.id) {
    try {
      technicianDetails = await getTechnicianProfile(user.technicianProfile.id);
    } catch {
      technicianDetails = null;
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 text-stone-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900 transition-colors duration-200">
      {/* 1. Header Navbar */}
      <Navbar />

      {/* 2. Main Profile Content matching reference layout */}
      <main className="flex-1 pt-20 sm:pt-24 pb-12">
        <ProfileLayout user={user} technicianDetails={technicianDetails} />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
