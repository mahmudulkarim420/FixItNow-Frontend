"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Star } from "lucide-react";

export function AuthBrandPanel() {
  const pathname = usePathname();
  const isRegister = pathname?.includes("/register");
  const bgImage = isRegister
    ? "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1600&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1600&auto=format&fit=crop";

  return (
    <div className="relative hidden overflow-hidden bg-stone-950 lg:flex lg:w-1/2 flex-col justify-between p-12 text-white selection:bg-amber-400 selection:text-stone-900 select-none">
      {/* Background Image with Dark Gradient Overlay */}
      <Image
        key={bgImage}
        src={bgImage}
        alt="FixItNow Authentication Banner"
        fill
        priority
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />

      {/* Top Header Logo (Left-aligned for Login, Right-aligned for Register) */}
      <div
        className={`relative z-10 flex ${
          isRegister ? "justify-end" : "justify-start"
        }`}
      >
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0 border border-amber-400/40 bg-stone-900 shadow-md">
            <Image
              src="/logo.png"
              alt="FixItNow Logo"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className={isRegister ? "text-right" : "text-left"}>
            <span className="font-extrabold text-2xl tracking-tight text-white block">
              FixItNow<span className="text-amber-400 font-extrabold">.</span>
            </span>
            <span className="block text-[10px] font-semibold text-amber-400/90 uppercase tracking-widest">
              Trusted Home Care
            </span>
          </div>
        </Link>
      </div>

      {/* Bottom Feature Showcase (Aligned cleanly depending on side) */}
      <div
        className={`relative z-10 space-y-6 max-w-md flex flex-col ${
          isRegister ? "ml-auto items-end text-right" : "mr-auto items-start text-left"
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Verified Local Repair Specialists</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight leading-snug text-white">
          Everyday Repairs Made <br />
          Simple, Transparent & Dependable.
        </h2>

        <div className="flex items-center gap-4 pt-4 border-t border-stone-800/80 text-xs text-stone-300 w-full justify-between sm:justify-start">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-medium text-stone-400">10,000+ Satisfied Homeowners</span>
        </div>
      </div>
    </div>
  );
}