"use client";

import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-stone-700 pt-12 sm:pt-16 pb-8 sm:pb-12 border-t border-stone-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Callout Bar */}
        <div className="pb-8 sm:pb-12 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-left">
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 tracking-tight">
              Ready to Transform Your Credit Score?
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Start rebuilding your credit standing today with expert tools.
            </p>
          </div>
          <Link
            href="#get-started"
            className="group inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-xs transition-all w-full sm:w-auto shrink-0 active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
          </Link>
        </div>

        {/* Main Footer Links */}
        <div className="py-10 sm:py-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info (Spans 2 cols on all breakpoints) */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center text-white font-black text-xs">
                F
              </div>
              <span className="font-bold text-xl tracking-tight text-stone-900">
                FixItNow<span className="text-amber-500 font-extrabold">.</span>
              </span>
            </Link>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-sm mb-5 font-normal">
              FixItNow is a premier credit restoration and financial education platform. We dispute inaccurate credit marks and empower you to build lasting credit health.
            </p>
            {/* Social Circle Icons */}
            <div className="flex items-center gap-3">
              {/* Twitter / X */}
              <a
                href="#"
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-stone-100 hover:bg-amber-500 hover:text-white text-stone-600 flex items-center justify-center transition-colors active:scale-95"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-stone-100 hover:bg-amber-500 hover:text-white text-stone-600 flex items-center justify-center transition-colors active:scale-95"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-stone-100 hover:bg-amber-500 hover:text-white text-stone-600 flex items-center justify-center transition-colors active:scale-95"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="#"
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-stone-100 hover:bg-amber-500 hover:text-white text-stone-600 flex items-center justify-center transition-colors active:scale-95"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column (1 col on mobile) */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium text-stone-600">
              <li><Link href="#app" className="hover:text-amber-600 transition-colors inline-block py-0.5">Home</Link></li>
              <li><Link href="#about" className="hover:text-amber-600 transition-colors inline-block py-0.5">About</Link></li>
              <li><Link href="#services" className="hover:text-amber-600 transition-colors inline-block py-0.5">Services</Link></li>
              <li><Link href="#pricing" className="hover:text-amber-600 transition-colors inline-block py-0.5">Pricing</Link></li>
              <li><Link href="#contact" className="hover:text-amber-600 transition-colors inline-block py-0.5">Contact</Link></li>
            </ul>
          </div>

          {/* Company Column (1 col on mobile) */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-2 text-xs font-medium text-stone-600">
              <li><Link href="#features" className="hover:text-amber-600 transition-colors inline-block py-0.5">Features</Link></li>
              <li><Link href="#solutions" className="hover:text-amber-600 transition-colors inline-block py-0.5">Solutions</Link></li>
              <li><Link href="#testimonials" className="hover:text-amber-600 transition-colors inline-block py-0.5">Testimonials</Link></li>
              <li><Link href="#faq" className="hover:text-amber-600 transition-colors inline-block py-0.5">FAQ</Link></li>
              <li><Link href="#privacy" className="hover:text-amber-600 transition-colors inline-block py-0.5">Privacy</Link></li>
            </ul>
          </div>

          {/* Subscribe Column (2 cols on mobile, 1 col on lg) */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 sm:mb-4">Subscribe</h4>
            <p className="text-stone-500 text-xs mb-3">Join our newsletter for credit score tips & updates.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row lg:flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-full bg-stone-100 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500 shrink-0"
              />
              <button
                type="submit"
                className="w-full sm:w-auto lg:w-full py-2.5 px-5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0 active:scale-95"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-stone-200/80 flex flex-col-reverse sm:flex-row items-center justify-between text-xs text-stone-500 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} FixItNow Inc. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="#privacy" className="hover:text-stone-800 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="#terms" className="hover:text-stone-800 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
