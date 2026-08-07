import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";

import Footer from "@/components/home/footer-section";
import Navbar from "@/components/home/navbar";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fixitnow.co").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "About Us — Transparent & Dependable Home Care",
  description: "Learn how FixItNow connects homeowners with vetted local repair experts for clear upfront pricing and 30-day guaranteed repairs.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About FixItNow — Dependable Home Repair Services",
    description: "Learn how FixItNow is making home repairs more transparent, human, and dependable.",
    url: `${SITE_URL}/about`,
  },
};

const values = [
  { icon: HeartHandshake, title: "People before process", text: "We make room for real conversations, clear expectations, and the little details that make service feel personal." },
  { icon: ShieldCheck, title: "Trust is the product", text: "Every expert is carefully reviewed, every price is shown upfront, and every visit is backed by a simple guarantee." },
  { icon: Leaf, title: "Repair more, replace less", text: "A thoughtful repair can save money, reduce waste, and keep the things you love working longer." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] dark:bg-slate-950 text-stone-900 dark:text-slate-100 selection:bg-amber-200 selection:text-amber-950 transition-colors duration-200">
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
          <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-amber-200/45 dark:bg-amber-500/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">A better way to get help</p>
              <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.045em] text-stone-950 dark:text-slate-100 sm:text-5xl lg:text-6xl leading-tight sm:leading-[1.05]">We believe home repair should feel human.</h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-stone-600 dark:text-slate-300 sm:text-base lg:text-lg">FixItNow started with a simple frustration: finding a great repair professional shouldn't take a dozen calls, hidden fees, or a leap of faith.</p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600 dark:text-slate-300 sm:text-base lg:text-lg">So we built a calmer way to care for the place you call home — pairing skilled local experts with thoughtful technology and a promise to make every step clearer.</p>
              <Link href="/services" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800 dark:hover:bg-amber-400 shadow-2xs">Meet our services <ArrowRight className="h-4 w-4 text-amber-400 dark:text-slate-950" /></Link>
            </div>
            <div className="relative lg:col-span-6">
              <div className="absolute -inset-3 rounded-[2rem] bg-amber-200/50 dark:bg-amber-500/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border-8 border-white dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_30px_70px_-35px_rgba(41,37,36,0.5)]">
                <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"><Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=85&w=1200" alt="Warm, welcoming home interior" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border border-white/70 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 p-3 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-xs"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400"><Sparkles className="h-5 w-5" /></span><p className="text-xs font-semibold leading-5 text-stone-700 dark:text-slate-300">Small repairs. More comfortable days.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-stone-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-16"><div className="lg:col-span-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Our north star</p><h2 className="mt-4 text-2xl font-extrabold tracking-tight text-stone-950 dark:text-slate-100 sm:text-3xl lg:text-4xl">Make the everyday easier.</h2></div><div className="lg:col-span-7 lg:col-start-6"><p className="text-lg leading-8 text-stone-700 dark:text-slate-200 sm:text-xl lg:text-2xl sm:leading-10">We're here for the dripping tap, the room that needs a little more light, and the appliance that chose the worst possible day to stop working.</p><p className="mt-5 text-sm leading-7 text-stone-500 dark:text-slate-400 sm:text-base">Our mission is to connect every household with dependable expertise, while giving local professionals a platform where their craft, time, and care are valued.</p></div></div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">What guides us</p><h2 className="mt-4 text-2xl font-extrabold tracking-tight text-stone-950 dark:text-slate-100 sm:text-3xl lg:text-4xl">Good service is felt in the details.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{values.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs sm:p-7"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400"><Icon className="h-5 w-5" /></div><h3 className="mt-6 text-lg font-bold text-stone-900 dark:text-slate-100">{title}</h3><p className="mt-3 text-sm leading-7 text-stone-500 dark:text-slate-400">{text}</p></div>)}</div></section>

        <section className="bg-stone-900 dark:bg-slate-900 border-t border-stone-800 dark:border-slate-800 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12"><div className="lg:col-span-7"><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">Our expert network</p><h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">Craft matters. We make it easier to find.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-stone-300 dark:text-slate-300 sm:text-base">From HVAC specialists and master plumbers to multi-skilled home-care pros, our network is built around people who take pride in leaving things better than they found them.</p></div><div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-4 lg:col-start-9"><div className="rounded-2xl border border-white/10 dark:border-slate-800 bg-white/10 dark:bg-slate-800/60 p-5"><Users className="h-5 w-5 text-amber-400" /><p className="mt-5 text-2xl sm:text-3xl font-extrabold">2.4k+</p><p className="mt-1 text-xs text-stone-400 dark:text-slate-400">trusted pros</p></div><div className="rounded-2xl border border-white/10 dark:border-slate-800 bg-white/10 dark:bg-slate-800/60 p-5"><ShieldCheck className="h-5 w-5 text-amber-400" /><p className="mt-5 text-2xl sm:text-3xl font-extrabold">4.9</p><p className="mt-1 text-xs text-stone-400 dark:text-slate-400">average rating</p></div></div></div></section>
      </main>
      <Footer />
    </div>
  );
}
