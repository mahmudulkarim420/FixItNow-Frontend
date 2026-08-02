import Footer from "@/components/home/Footer";
import { NavbarClient } from "@/components/shared/navbar-client";
import { PaymentSuccessSkeleton } from "@/components/ui/skeletons";

export default function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900">
      <NavbarClient />
      <PaymentSuccessSkeleton />
      <Footer />
    </div>
  );
}
