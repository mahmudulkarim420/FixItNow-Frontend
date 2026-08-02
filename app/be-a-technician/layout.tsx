import type { Metadata } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fixitnow.co").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Be a Technician — Join Our Verified Pro Network",
  description:
    "Apply to become a FixItNow technician. Earn steady income, set your own rates and schedule, and connect with local homeowners needing expert repairs.",
  alternates: {
    canonical: "/be-a-technician",
  },
  openGraph: {
    title: "Become a FixItNow Technician — Join Our Pro Network",
    description:
      "Earn steady income, choose your service areas, and connect with thousands of local homeowners needing skilled repairs.",
    url: `${SITE_URL}/be-a-technician`,
  },
};

export default function BeATechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
