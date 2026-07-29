"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const reviews = [
    // Row 1
    {
      id: 1,
      name: "Sarah Mitchell",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      text: "FixItNow sent an HVAC specialist within 45 minutes of booking when our AC unit cut out on a 90° day. Honest assessment, clean work, and cool air restored immediately!",
      authorSign: "— Sarah M., AC Repair Customer",
      date: "12 January 2026",
      isYellowBg: true, // Yellow background
      colSpan: "md:col-span-7", // Big size
    },
    {
      id: 2,
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      text: "The master plumber arrived right on time, explained the exact cause of our kitchen pipe leak, and gave a fair upfront price before starting. Excellent service!",
      authorSign: "— David C., Plumbing Customer",
      date: "28 February 2026",
      isYellowBg: false, // White background
      colSpan: "md:col-span-5", // Smaller size
    },
    // Row 2
    {
      id: 3,
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      text: "Had 3 ceiling fans and smart light switches installed in one afternoon. The electrician was super tidy, friendly, and tested everything before leaving.",
      authorSign: "— Marcus V., Electrical Customer",
      date: "15 March 2026",
      isYellowBg: false, // White background
      colSpan: "md:col-span-5", // Smaller size
    },
    {
      id: 4,
      name: "Elena Rodriguez",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      text: "Our washing machine was making an awful grinding noise. FixItNow diagnosed a worn belt, replaced it with an original part, and saved us from buying a new machine!",
      authorSign: "— Elena R., Appliance Customer",
      date: "02 April 2026",
      isYellowBg: true, // Yellow background
      colSpan: "md:col-span-7", // Big size
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 relative bg-[#F9F7F2]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            {"What Homeowners Are Saying"}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Read authentic stories from real clients who restored their home comfort with FixItNow.
          </p>
        </div>

        {/* Alternating Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`${review.colSpan} p-6 sm:p-7 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                review.isYellowBg
                  ? "bg-[#FFF9E6] border-amber-200/90 shadow-2xs"
                  : "bg-white border-amber-200/50 shadow-2xs"
              }`}
            >
              <div>
                {/* Header: Avatar + Name + Star Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-stone-200">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 leading-tight">
                      {review.name}
                    </h3>
                    {/* Star Rating: 5 Filled */}
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                          viewBox="0 0 24 24"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-stone-600 text-sm leading-relaxed mb-3">
                  {review.text}
                </p>

                {/* Author Sign */}
                <p className="text-stone-600 text-sm font-medium mb-6">
                  {review.authorSign}
                </p>
              </div>

              {/* Date */}
              <div className="text-sm font-bold text-stone-900">
                {review.date}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
