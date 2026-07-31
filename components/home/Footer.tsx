import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, Send, Share2, Wrench } from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "Home", href: "/" },
    { label: "All services", href: "/services" },
    { label: "How it works", href: "/how-it-works" },
  ],
  Company: [
    { label: "About FixItNow", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "Become a Technician", href: "/be-a-technician" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-white text-stone-700">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-stone-200/80 pb-10 sm:flex-row sm:items-center sm:pb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Ready when you are</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
              A better home starts with one small fix.
            </h2>
          </div>
          <Link href="/services" className="group inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-xs font-bold text-white transition hover:bg-stone-800">
            Explore services
            <ArrowUpRight className="h-4 w-4 text-amber-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12 lg:py-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-stone-200/80 bg-white">
                <Image
                  src="/logo.png"
                  alt="FixItNow Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900">FixItNow<span className="text-amber-500 font-extrabold">.</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-stone-500">
              Trusted repair professionals for the everyday moments that keep your home running beautifully.
            </p>
            <div className="mt-5 flex gap-2">
              {[Share2, Send].map((Icon, index) => (
                <a key={index} href="#" aria-label="Follow FixItNow" className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition hover:bg-amber-500 hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">{title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-stone-500">
                {links.map((link) => <li key={link.label}><Link href={link.href} className="transition hover:text-amber-700">{link.label}</Link></li>)}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-stone-500">
              <li><a href="tel:+18005550140" className="flex items-center gap-2 hover:text-amber-700"><Phone className="h-4 w-4 text-amber-600" /> (800) 555-0140</a></li>
              <li><a href="mailto:hello@fixitnow.co" className="flex items-center gap-2 hover:text-amber-700"><Mail className="h-4 w-4 text-amber-600" /> hello@fixitnow.co</a></li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> Serving homes across the city</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-stone-200/80 pt-6 text-center text-xs text-stone-500 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <div className="flex gap-5"><Link href="#privacy" className="hover:text-stone-900">Privacy</Link><Link href="#terms" className="hover:text-stone-900">Terms</Link></div>
        </div>
      </div>
    </footer>
  );
}
