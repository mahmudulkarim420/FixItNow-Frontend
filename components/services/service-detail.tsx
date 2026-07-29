"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { fetchServices, fetchTechnicianProfile, mapApiServiceToUI } from "@/lib/services-api";
import type { RepairService } from "@/lib/services-data";
import type { TechnicianProfile } from "@/types";

interface ServiceDetailProps {
  service: RepairService;
}

export function ServiceDetail({ service }: ServiceDetailProps) {
  const [booked, setBooked] = useState(false);
  const [relatedServices, setRelatedServices] = useState<RepairService[]>([]);
  const [techProfile, setTechProfile] = useState<TechnicianProfile | null>(null);

  useEffect(() => {
    let isMounted = true;
    const techId = service.technicianProfileId || service.technician.id;
    if (techId) {
      fetchTechnicianProfile(techId)
        .then((res) => {
          if (isMounted && res) {
            setTechProfile(res);
          }
        })
        .catch(() => {
          /* Swallow error for fallback */
        });
    }
    return () => {
      isMounted = false;
    };
  }, [service.technicianProfileId, service.technician.id]);

  useEffect(() => {
    let isMounted = true;
    fetchServices({ limit: 4 })
      .then((res) => {
        if (isMounted && res.data) {
          const mapped = res.data
            .map(mapApiServiceToUI)
            .filter((s) => s.id !== service.id)
            .slice(0, 3);
          setRelatedServices(mapped);
        }
      })
      .catch(() => {
        /* Swallow error for related services fallback */
      });
    return () => {
      isMounted = false;
    };
  }, [service.id]);

  const techName = techProfile?.user?.name || service.technician.name;
  const techEmail = techProfile?.user?.email || service.technician.email;
  const techBio = techProfile?.bio || service.technician.bio;
  const techLocation = techProfile?.location || service.technician.location || "Dhaka, Bangladesh";
  const techExperience = techProfile?.experience
    ? `${techProfile.experience} Years Exp`
    : service.technician.experience;
  const techHourlyRate = techProfile?.hourlyRate || service.technician.hourlyRate;
  const techSkills = techProfile?.skills || service.technician.skills || [];
  const techRating = techProfile?.averageRating || service.technician.rating;
  const techJobs = techProfile?.totalReviews || service.technician.jobs;
  const techIsVerified = techProfile?.isVerified ?? service.technician.isVerified ?? true;

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900 selection:bg-amber-200 selection:text-amber-950">
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-500 transition hover:text-amber-700"
        >
          <ArrowLeft className="h-4 w-4 text-amber-600" />
          <span>Back to all services</span>
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          {/* Main Detail Content */}
          <div>
            <div className="overflow-hidden rounded-3xl border border-white bg-white p-2 shadow-[0_20px_60px_-35px_rgba(41,37,36,0.45)]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-stone-100 sm:aspect-[16/8]">
                <Image
                  src={service.image}
                  alt={`${service.name} service`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-white sm:bottom-7 sm:left-7 sm:right-7">
                  <div>
                    <span className="rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-stone-950 shadow-sm">
                      {service.badge}
                    </span>
                    <p className="mt-3 text-sm font-semibold text-white/90">
                      {service.category} Service
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-2 text-xs font-bold backdrop-blur-md border border-white/30">
                    <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />{" "}
                    {service.rating} Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Verified Service Package</span>
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-stone-950">
                {service.name}
              </h1>
              <p className="mt-4 text-base leading-8 text-stone-600">
                {service.longDescription}
              </p>
            </div>

            <div className="mt-10 grid gap-6 border-t border-stone-200/80 pt-8 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-5 backdrop-blur-md">
                <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-600" /> What's Included
                </h2>
                <ul className="mt-4 space-y-3">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-xs sm:text-sm leading-6 text-stone-600 font-medium"
                    >
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-5 backdrop-blur-md">
                <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-600" /> Why FixItNow Guarantee
                </h2>
                <ul className="mt-4 space-y-3">
                  {service.features.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-xs sm:text-sm leading-6 text-stone-600 font-medium"
                    >
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dynamic Assigned Technician Profile Card */}
            <div className="mt-10 rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-md backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={service.technician.image}
                    alt={techName}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                        Assigned Technician
                      </span>
                      {techIsVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                          <Check className="h-3 w-3 text-amber-600" /> Verified Pro
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-0.5 text-lg font-extrabold text-stone-900">
                      {techName}
                    </h2>
                    {techEmail ? (
                      <p className="text-xs text-stone-500 font-medium">
                        {techEmail}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-900 sm:justify-end">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{techRating} Rating</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Technician Details: Bio, Location, Hourly Rate, Skills */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs text-stone-600 font-medium pt-1">
                {techBio ? (
                  <div className="sm:col-span-2 rounded-xl bg-stone-50/80 p-3 border border-stone-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Technician Bio
                    </p>
                    <p className="text-stone-700 leading-relaxed">{techBio}</p>
                  </div>
                ) : null}

                <div className="flex items-center gap-2 rounded-xl bg-stone-50/70 p-3 border border-stone-100">
                  <MapPin className="h-4 w-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Location</span>
                    <span className="font-bold text-stone-900">{techLocation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-stone-50/70 p-3 border border-stone-100">
                  <Clock3 className="h-4 w-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Experience & Rate</span>
                    <span className="font-bold text-stone-900">
                      {techExperience} {techHourlyRate ? `· $${techHourlyRate}/hr` : ""}
                    </span>
                  </div>
                </div>

                {techSkills && techSkills.length > 0 ? (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1.5">Trade Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {techSkills.map((sk) => (
                        <span
                          key={sk}
                          className="rounded-lg bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-800 border border-stone-200/60"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Related Services Section */}
            {relatedServices.length > 0 ? (
              <div className="mt-14 border-t border-stone-200/80 pt-10">
                <h3 className="text-xl font-extrabold text-stone-900 mb-6">
                  Similar Repair Services
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {relatedServices.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/services/${rel.id}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white p-3.5 shadow-2xs hover:border-amber-400 hover:shadow-md transition"
                    >
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-3">
                        <Image
                          src={rel.image}
                          alt={rel.name}
                          fill
                          sizes="200px"
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <p className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-amber-700">
                        {rel.name}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs font-extrabold">
                        <span className="text-amber-800">${rel.price}</span>
                        <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-stone-900" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sticky Pricing Sidebar */}
          <aside className="sticky top-28 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-[0_20px_55px_-35px_rgba(41,37,36,0.45)]">
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  {service.priceLabel}
                </p>
                <p className="mt-1 text-4xl font-black text-stone-950">
                  ${service.price}
                </p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-800">
                Verified Price
              </span>
            </div>

            <div className="space-y-4 py-5 text-xs font-semibold text-stone-600">
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Available in your neighborhood</span>
              </p>
              <p className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Backed by 30-day warranty</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setBooked(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-4 text-sm font-extrabold text-stone-950 shadow-md shadow-amber-500/20 transition hover:bg-amber-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 cursor-pointer"
            >
              <span>Book Service Now</span>
              <ArrowRight className="h-4 w-4 text-stone-950" />
            </button>

            <p className="mt-3 text-center text-[11px] leading-5 text-stone-400 font-medium">
              Select time slot and schedule instantly. No upfront deposit required.
            </p>
          </aside>
        </div>
      </main>

      {/* Booking Confirmation Dialog */}
      {booked ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl border border-stone-200">
            <button
              type="button"
              onClick={() => setBooked(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              aria-label="Close confirmation"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Check className="h-7 w-7" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-amber-700">
              Booking Request Received
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-stone-900">
              Service Appointment Reserved
            </h2>
            <p className="mt-3 text-xs leading-6 text-stone-500">
              We've created an appointment request for{" "}
              <strong className="text-stone-800">{service.name}</strong>. Our local care coordinator will contact you shortly to confirm technician arrival details.
            </p>
            <button
              type="button"
              onClick={() => setBooked(false)}
              className="mt-6 w-full rounded-2xl bg-stone-900 px-5 py-3 text-xs font-extrabold text-white hover:bg-stone-800 transition cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ServiceNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F9F7F2] p-6 text-center">
      <div className="max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <Users className="mx-auto h-12 w-12 text-amber-600" />
        <h1 className="mt-4 text-2xl font-extrabold text-stone-900">Service Not Found</h1>
        <p className="mt-2 text-xs text-stone-500 leading-relaxed">
          The requested service ID may have been updated or removed. Please explore our full catalog of home repair services.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-xs font-bold text-white hover:bg-stone-800 transition"
        >
          <span>Browse All Services</span>
          <ArrowRight className="h-4 w-4 text-amber-400" />
        </Link>
      </div>
    </div>
  );
}
