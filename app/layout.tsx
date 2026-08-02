import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fixitnow.co").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FixItNow — Professional Home Repair & Maintenance Services",
    template: "%s | FixItNow",
  },
  description:
    "Book trusted local experts for AC, plumbing, electrical, appliance, and everyday home repairs with transparent upfront pricing and a 30-day service guarantee.",
  keywords: [
    "home repair",
    "local technicians",
    "AC repair",
    "plumbing services",
    "electrical maintenance",
    "appliance repair",
    "handyman service",
    "FixItNow",
  ],
  applicationName: "FixItNow",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "FixItNow",
    title: "FixItNow — Professional Home Repair & Maintenance Services",
    description:
      "Book trusted local experts for AC, plumbing, electrical, appliance, and everyday home repairs with clear upfront pricing.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "FixItNow Trusted Home Services Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FixItNow — Professional Home Repair & Maintenance Services",
    description:
      "Book trusted local experts for AC, plumbing, electrical, appliance, and everyday home repairs with clear upfront pricing.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

