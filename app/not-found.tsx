import type { Metadata } from "next";
import { NotFoundClient } from "@/components/ui/not-found-client";

export const metadata: Metadata = {
  title: "Page Not Found · FixItNow",
  description: "The requested page or service could not be found on FixItNow.",
};

export default function NotFoundPage() {
  return <NotFoundClient />;
}
