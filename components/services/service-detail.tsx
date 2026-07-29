"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock3, MapPin, ShieldCheck, Star, Users, X } from "lucide-react";
import { useState } from "react";

import type { RepairService } from "@/lib/services-data";

interface ServiceDetailProps {
  service: RepairService;
}

export function ServiceDetail({ service }: ServiceDetailProps) {
  const [booked, setBooked] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-stone-900 selection:bg-amber-200 selection:text-amber-950">
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-amber-700">
          <ArrowLeft className="h-4 w-4" />
          Back to all services
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <div>
            <div className="overflow-hidden rounded-2xl border border-white bg-white p-2 shadow-[0_20px_60px_-35px_rgba(41,37,36,0.45)]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-stone-100 sm:aspect-[16/8]">
                <Image src={service.image} alt={`${service.name} service`} fill priority sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-white sm:bottom-7 sm:left-7 sm:right-7">
                  <div>
                    <span className="rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-stone-950">{service.badge}</span>
                    <p className="mt-3 text-sm font-semibold text-white/80">{service.category} service</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" /> {service.rating} · {service.reviews} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700">{service.tagline}</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-stone-950 sm:text-5xl">{service.name}</h1>
              <p className="mt-5 text-base leading-8 text-stone-600">{service.longDescription}</p>
            </div>

            <div className="mt-10 grid gap-6 border-t border-stone-200 pt-8 sm:grid-cols-2">
              <div>
                <h2 className="text-lg font-bold text-stone-900">What's included</h2>
                <ul className="mt-4 space-y-3">
                  {service.includes.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-stone-600"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"><Check className="h-3.5 w-3.5" /></span>{item}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">Why FixItNow</h2>
                <ul className="mt-4 space-y-3">
                  {service.features.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-stone-600"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white"><Check className="h-3.5 w-3.5" /></span>{item}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4 rounded-2xl border border-stone-200/80 bg-white/70 p-4 sm:p-5">
              <Image src={service.technician.image} alt={service.technician.name} width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Your local expert</p>
                <h2 className="mt-1 font-bold text-stone-900">{service.technician.name}</h2>
                <p className="text-sm text-stone-500">{service.technician.role} · {service.technician.experience}</p>
              </div>
              <div className="hidden text-right sm:block"><p className="flex items-center gap-1 text-sm font-bold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{service.technician.rating}</p><p className="mt-1 text-xs text-stone-500">{service.technician.jobs.toLocaleString()} jobs</p></div>
            </div>
          </div>

          <aside className="sticky top-28 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_20px_55px_-35px_rgba(41,37,36,0.55)] sm:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-stone-400">{service.priceLabel}</p><p className="mt-1 text-4xl font-extrabold text-stone-950">${service.price}</p></div><span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">Fair pricing</span></div>
            <div className="space-y-4 py-5 text-sm text-stone-600"><p className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-amber-600" /> Usually takes {service.duration}</p><p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-amber-600" /> Available in your area</p><p className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-amber-600" /> Backed by our service guarantee</p></div>
            <button type="button" onClick={() => setBooked(true)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-stone-950 shadow-sm transition hover:bg-amber-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200">Book now <ArrowRight className="h-4 w-4" /></button>
            <p className="mt-3 text-center text-xs leading-5 text-stone-400">Choose your preferred time after checkout. No payment is taken in this demo.</p>
          </aside>
        </div>
      </main>

      {booked ? <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm"><div className="relative w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl"><button type="button" onClick={() => setBooked(false)} className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700" aria-label="Close confirmation"><X className="h-4 w-4" /></button><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700"><Check className="h-7 w-7" /></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Demo booking confirmed</p><h2 className="mt-2 text-2xl font-extrabold text-stone-900">You're on the list.</h2><p className="mt-3 text-sm leading-6 text-stone-500">We've reserved a mock appointment request for <strong className="text-stone-700">{service.name}</strong>. In the full experience, you'd pick a time and confirm your address here.</p><button type="button" onClick={() => setBooked(false)} className="mt-6 w-full rounded-xl bg-stone-900 px-5 py-3 text-sm font-bold text-white hover:bg-stone-800">Continue browsing</button></div></div> : null}
    </div>
  );
}

export function ServiceNotFound() {
  return <div className="flex min-h-screen items-center justify-center bg-[#F9F7F2] p-6 text-center"><div><Users className="mx-auto h-10 w-10 text-amber-600" /><h1 className="mt-4 text-2xl font-bold text-stone-900">Service not found</h1><p className="mt-2 text-sm text-stone-500">This mock service may have moved.</p><Link href="/services" className="mt-5 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-bold text-white">Browse services</Link></div></div>;
}
