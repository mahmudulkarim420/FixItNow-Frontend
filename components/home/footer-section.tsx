import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, Send, Share2 } from "lucide-react";

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
    <footer className="border-t border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 text-stone-700 dark:text-slate-300 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-stone-200/80 dark:border-slate-800 pb-10 sm:flex-row sm:items-center sm:pb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Ready when you are</p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-stone-900 dark:text-slate-100 sm:text-2xl lg:text-3xl">
              A better home starts with one small fix.
            </h2>
          </div>
          <Link href="/services" className="group inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-6 py-3 text-xs font-bold text-white transition hover:bg-stone-800 dark:hover:bg-amber-400">
            Explore services
            <ArrowUpRight className="h-4 w-4 text-amber-400 dark:text-slate-950 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-8 py-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12 lg:py-12">
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center border border-stone-200/80 dark:border-slate-700 bg-white dark:bg-slate-800">
                <Image
                  src="/logo.png"
                  alt="FixItNow Logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-slate-100">FixItNow<span className="text-amber-500 font-extrabold">.</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-xs sm:text-sm leading-6 text-stone-500 dark:text-slate-400">
              Trusted repair professionals for the everyday moments that keep your home running beautifully.
            </p>
            <div className="mt-4 sm:mt-5 flex gap-2">
              {[Share2, Send].map((Icon, index) => (
                <a key={index} href="#" aria-label="Follow FixItNow" className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 transition hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-slate-950">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-slate-200">{title}</h3>
              <ul className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-stone-500 dark:text-slate-400">
                {links.map((link) => <li key={link.label}><Link href={link.href} className="transition hover:text-amber-700 dark:hover:text-amber-400">{link.label}</Link></li>)}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-slate-200">Get in touch</h3>
            <ul className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-stone-500 dark:text-slate-400">
              <li><a href="tel:+18005550140" className="flex items-center gap-2 hover:text-amber-700 dark:hover:text-amber-400"><Phone className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" /> (800) 555-0140</a></li>
              <li><a href="mailto:hello@fixitnow.co" className="flex items-center gap-2 hover:text-amber-700 dark:hover:text-amber-400"><Mail className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" /> hello@fixitnow.co</a></li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" /> Serving homes across the city</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between gap-3 border-t border-stone-200/80 dark:border-slate-800 pt-6 text-[11px] sm:text-xs text-stone-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-5"><Link href="#privacy" className="hover:text-stone-900 dark:hover:text-slate-200">Privacy</Link><Link href="#terms" className="hover:text-stone-900 dark:hover:text-slate-200">Terms</Link></div>
        </div>
      </div>
    </footer>
  );
}
