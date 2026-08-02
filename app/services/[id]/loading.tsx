import { ServiceDetailSkeleton } from "@/components/ui/skeletons";

export default function ServiceDetailLoading() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <main className="pt-20 sm:pt-24">
        <ServiceDetailSkeleton />
      </main>
    </div>
  );
}
