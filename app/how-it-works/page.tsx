import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  HelpCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import Footer from "@/components/home/footer-section";
import Navbar from "@/components/home/navbar";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fixitnow.co").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "How It Works — Simple & Transparent Home Repairs",
  description:
    "Learn how FixItNow connects you with background-checked local repair professionals in 4 simple steps with clear upfront pricing.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How FixItNow Works for Your Home",
    description:
      "From instant booking to completed repair, see how we connect you with verified local experts in 4 easy steps.",
    url: `${SITE_URL}/how-it-works`,
  },
};

const steps = [
  {
    step: "01",
    title: "Select Your Service",
    description:
      "Choose from AC repair, plumbing, electrical, appliance, or home care. See clear upfront starting prices before you book.",
    icon: Search,
    color: "bg-sky-500/10 text-sky-600 border-sky-200",
  },
  {
    step: "02",
    title: "Choose Date & Time Window",
    description:
      "Pick a convenient appointment slot that fits your schedule, or select emergency same-day dispatch for urgent leaks and cooling issues.",
    icon: CalendarCheck,
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
  },
  {
    step: "03",
    title: "Vetted Local Expert Arrives",
    description:
      "A background-checked, licensed specialist arrives equipped with tools and parts, inspects the problem, and confirms the repair plan.",
    icon: Wrench,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  },
  {
    step: "04",
    title: "Relax with 30-Day Guarantee",
    description:
      "Work is completed cleanly and tested for full performance. All repairs are backed by our 30-day 100% satisfaction guarantee.",
    icon: ShieldCheck,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  },
];

const trustPillars = [
  {
    title: "Nationwide Background Checks",
    description:
      "Every technician passes criminal background checks and identity verification before joining our roster.",
    icon: BadgeCheck,
  },
  {
    title: "Licensed & Fully Insured",
    description:
      "All active specialists hold current trade licenses and general liability insurance for total home protection.",
    icon: ShieldCheck,
  },
  {
    title: "Strict Upfront Pricing Policy",
    description:
      "No mystery fees or sudden markups. You approve the transparent repair price before any work begins.",
    icon: CheckCircle2,
  },
  {
    title: "High Rating Standard (4.8+)",
    description:
      "We continuously audit service reviews. Professionals must maintain a 4.8+ customer rating to remain active.",
    icon: Sparkles,
  },
];

const faqs = [
  {
    q: "How fast can a technician arrive for emergency repairs?",
    a: "For urgent plumbing leaks or AC failures during extreme weather, our emergency dispatch matches you with available local pros aiming to arrive within 45 to 60 minutes.",
  },
  {
    q: "What if replacement parts are needed during the visit?",
    a: "Our technicians carry standard OEM parts in their service vehicles. If a specialized part is required, they will provide a clear itemized quote for your approval before ordering.",
  },
  {
    q: "How does the 30-day service guarantee work?",
    a: "If the same issue recurs within 30 days of service, we will send a technician back to inspect and resolve it at zero additional labor cost to you.",
  },
  {
    q: "Are there any hidden call-out fees?",
    a: "No. All prices and diagnostic estimates are displayed upfront before you confirm your booking request.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900 selection:bg-amber-200 selection:text-amber-950">
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* Header Hero Section */}
        <section className="relative overflow-hidden px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 [mask-image:radial-gradient(ellipse_65%_75%_at_50%_30%,#000,transparent)]" />
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-amber-300/35 blur-3xl" />

          <div className="relative mx-auto max-w-7xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-800">
              <Sparkles className="h-3.5 w-3.5" /> Simple, Transparent & Reliable
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl text-3xl font-extrabold tracking-[-0.045em] text-stone-950 sm:text-5xl lg:text-6xl">
              How FixItNow Works for Your Home.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base lg:text-lg">
              From instant booking to completed repair, see how we connect you with background-checked local experts in 4 easy steps.
            </p>
          </div>
        </section>

        {/* 4 Steps Section */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ step, title, description, icon: Icon, color }) => (
              <div
                key={step}
                className="relative flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black tracking-tight text-stone-300">
                      {step}
                    </span>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${color}`}
                    >
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-stone-900">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-xs leading-6 text-stone-500 sm:text-sm">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Row below steps */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-sm font-bold text-stone-950 shadow-md transition hover:bg-amber-400"
            >
              <span>Browse All Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Trust & Vetting Standards */}
        <section className="border-y border-stone-200/80 bg-white/70 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                Our Expert Quality Standard
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-stone-950 sm:text-3xl lg:text-4xl">
                Every pro is vetted so you can rest easy.
              </h2>
              <p className="mt-4 text-xs sm:text-sm md:text-base text-stone-600">
                We believe bringing someone into your home requires total trust. Here is how we ensure top-quality service on every visit.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trustPillars.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-stone-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-stone-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
              <HelpCircle className="h-3.5 w-3.5 text-amber-600" /> Got Questions?
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-stone-950 sm:text-3xl lg:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-xs"
              >
                <h3 className="text-base font-bold text-stone-900">{q}</h3>
                <p className="mt-2.5 text-xs leading-6 text-stone-600 sm:text-sm">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="bg-stone-900 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
              Ready to get started?
            </p>
            <h2 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Your home repair is just a few clicks away.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
              Book a verified specialist today with clear pricing and our 30-day service guarantee.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-sm font-bold text-stone-950 shadow-md transition hover:bg-amber-400"
              >
                <span>Find Your Repair Service</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
