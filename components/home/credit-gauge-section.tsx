import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Clock, Star, Award } from "lucide-react";

export default function CreditGaugeSection() {
  const bulletPoints = [
    {
      icon: Award,
      text: "Certified & background-checked local technicians",
    },
    {
      icon: CheckCircle2,
      text: "Upfront transparent pricing with zero surprise fees",
    },
    {
      icon: Clock,
      text: "Same-day response for urgent plumbing & AC repairs",
    },
    {
      icon: ShieldCheck,
      text: "Backed by our 30-day 100% satisfaction guarantee",
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative bg-[#F9F7F2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Subtitle, Bullet List & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-6">
              Home repairs made simple, <br />
              reliable, and stress-free.
            </h2>

            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed mb-8">
              Over 10,000+ homeowners trust FixItNow for fast, dependable, and high-quality repairs across AC, plumbing, electrical, and household appliances.
            </p>

            {/* Bullet Points */}
            <div className="space-y-4 mb-8">
              {bulletPoints.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-stone-800">{item.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span>Find Your Service</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Service Quality Gauge Meter Card */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-white border border-stone-200/80 shadow-md">
              {/* Floating Performance Pills */}
              {/* Avg Rating Pill Top Right */}
              <div className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-200 shadow-xs flex items-center gap-2 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-stone-500">Rating</span>
                <span className="text-stone-900 font-bold">4.9 / 5.0</span>
              </div>

              {/* Arrival Time Pill Middle Left */}
              <div className="absolute top-24 left-6 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 shadow-xs flex items-center gap-2 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-stone-500">Avg Arrival</span>
                <span className="text-stone-900 font-bold">45 min</span>
              </div>

              {/* Satisfaction Pill Bottom Left */}
              <div className="absolute bottom-10 left-6 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 shadow-xs flex items-center gap-2 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-stone-500">First Visit Fix</span>
                <span className="text-stone-900 font-bold">99.4%</span>
              </div>

              {/* Semicircular SVG Gauge Meter */}
              <div className="flex flex-col items-center pt-10 pb-4">
                <div className="relative w-64 h-36 flex items-end justify-center">
                  <svg className="w-full h-full" viewBox="0 0 200 110">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    {/* Background Arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#F3F4F6"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* Gradient Arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    {/* Gauge Needle */}
                    <g transform="translate(100, 100) rotate(55)">
                      <polygon points="-4,-5 0,-70 4,-5" fill="#18181B" />
                      <circle cx="0" cy="0" r="7" fill="#18181B" />
                      <circle cx="0" cy="0" r="3" fill="#F59E0B" />
                    </g>
                  </svg>
                </div>

                {/* Score Text */}
                <div className="text-center mt-2">
                  <div className="text-xs uppercase font-extrabold tracking-widest text-stone-900">
                    SERVICE QUALITY INDEX
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 mt-1">
                    Top Rated Household Platform
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
