import type { Metadata } from "next";
import { Clock3, Mail, MapPin, Phone, Sparkles } from "lucide-react";

import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import { ContactForm } from "@/components/shared/contact-form";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fixitnow.co").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Contact Us — Support & Booking Inquiries",
  description: "Get in touch with the FixItNow care team for appointment support, repair service questions, or technician partnerships.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact FixItNow — Real People, Ready to Help",
    description: "Get in touch with the FixItNow care team for appointment support, repair service questions, or technician partnerships.",
    url: `${SITE_URL}/contact`,
  },
};

const contactItems = [
  { icon: Phone, title: "Call us", detail: "(800) 555-0140", note: "Mon-Sat, 8am-8pm", href: "tel:+18005550140" },
  { icon: Mail, title: "Email us", detail: "hello@fixitnow.co", note: "Reply within one business day", href: "mailto:hello@fixitnow.co" },
  { icon: MapPin, title: "Visit us", detail: "42 Hearth Avenue", note: "Portland, OR 97205", href: "https://maps.google.com" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900 selection:bg-amber-200 selection:text-amber-950">
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <section className="relative overflow-hidden px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 [mask-image:radial-gradient(ellipse_65%_75%_at_50%_30%,#000,transparent)]" />
          <div className="relative mx-auto max-w-7xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800"><Sparkles className="h-3.5 w-3.5" /> Real people, ready to help</span>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-[-0.045em] text-stone-950 sm:text-6xl">Let's get things sorted.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">Questions about a repair, an appointment, or joining our expert network? Send us a note and we'll help you find the next step.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-3">
            {contactItems.map(({ icon: Icon, title, detail, note, href }) => (
              <a key={title} href={href} target={title === "Visit us" ? "_blank" : undefined} rel={title === "Visit us" ? "noreferrer" : undefined} className="group rounded-xl border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-amber-300 sm:p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition group-hover:bg-amber-500 group-hover:text-stone-950"><Icon className="h-5 w-5" /></span>
                <h2 className="mt-5 text-sm font-bold text-stone-900">{title}</h2><p className="mt-1 text-sm font-semibold text-amber-700">{detail}</p><p className="mt-1 text-xs text-stone-400">{note}</p>
              </a>
            ))}
          </div>

          <div className="mt-8 grid overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_24px_70px_-40px_rgba(41,37,36,0.45)] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative hidden min-h-[620px] overflow-hidden bg-stone-900 p-10 text-white lg:block">
              <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#44403c_1px,transparent_1px),linear-gradient(to_bottom,#44403c_1px,transparent_1px)] bg-[size:3rem_3rem]" />
              <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-amber-500/30 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">Support that listens</p><h2 className="mt-5 text-4xl font-extrabold leading-tight">Your home deserves a clear answer.</h2><p className="mt-5 text-sm leading-7 text-stone-300">Our care team knows the difference between an urgent leak and a long-term project. We'll listen first, then connect you to the right help.</p></div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur"><Clock3 className="h-5 w-5 text-amber-400" /><p className="mt-4 text-sm font-bold">Need immediate booking help?</p><p className="mt-2 text-xs leading-5 text-stone-400">Call our support line Monday through Saturday, from 8am to 8pm.</p></div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
