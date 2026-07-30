"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ShieldCheck, Heart, Loader2, ArrowUpRight, Wrench } from "lucide-react";
import { getSavedServices, toggleSaveService } from "@/lib/saved-services";
import { fetchServices, mapApiServiceToUI } from "@/lib/services-api";
import type { RepairService } from "@/lib/services-data";

export default function CustomerSavedProsPage() {
  const [savedPros, setSavedPros] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSavedData() {
      try {
        setLoading(true);
        const localSaved = getSavedServices();
        if (localSaved.length > 0) {
          setSavedPros(localSaved);
        } else {
          // If no local items saved yet, fetch top catalog services so page presents verified pros to save
          const res = await fetchServices({ limit: 6 });
          if (res && res.data && res.data.length > 0) {
            const mapped = res.data.map(mapApiServiceToUI);
            setSavedPros(mapped);
          }
        }
      } catch {
        setSavedPros([]);
      } finally {
        setLoading(false);
      }
    }

    loadSavedData();

    const handleSync = () => {
      const updated = getSavedServices();
      if (updated.length > 0) {
        setSavedPros(updated);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("saved-services-updated", handleSync);
      return () => window.removeEventListener("saved-services-updated", handleSync);
    }
  }, []);

  const handleRemoveSaved = (pro: RepairService) => {
    toggleSaveService(pro);
    setSavedPros((prev) => prev.filter((p) => p.id !== pro.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900">
            Saved Technicians & Services
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-stone-500">
            Quickly rebook trusted, verified local technicians saved in your favorites list.
          </p>
        </div>

        <Link
          href="/services"
          className="flex items-center gap-1.5 rounded-2xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-stone-800 self-start sm:self-auto"
        >
          <Wrench className="h-4 w-4 text-amber-400" />
          <span>Explore Service Catalog</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-stone-500">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500 mr-2" />
          <span className="text-xs font-bold">Loading your saved services...</span>
        </div>
      ) : savedPros.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <Heart className="h-8 w-8 text-stone-300 mx-auto mb-2" />
          <p className="text-stone-700 font-bold text-sm">No saved services yet</p>
          <p className="text-stone-400 text-xs mt-1">
            Click the wishlist heart icon on any service in our catalog to save it here for fast rebooking.
          </p>
          <Link
            href="/services"
            className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-stone-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-stone-800"
          >
            Explore Verified Pros
          </Link>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {savedPros.map((pro) => (
            <div
              key={pro.id}
              className="group rounded-3xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pro.technician?.image || pro.image}
                      alt={pro.technician?.name || pro.name}
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-stone-100 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="text-base font-bold text-stone-900">{pro.technician?.name || pro.name}</h3>
                        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      </div>
                      <p className="text-xs text-stone-400 font-medium">{pro.name}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveSaved(pro)}
                    aria-label="Remove from saved"
                    className="text-rose-500 hover:scale-110 transition-transform p-1 cursor-pointer"
                  >
                    <Heart className="h-5 w-5 fill-rose-500" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-600 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{pro.rating} ★ ({pro.reviews} reviews)</span>
                  </span>
                  <span className="text-stone-900 font-extrabold">${pro.price}.00</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  {pro.category}
                </span>
                <Link
                  href={`/services/${pro.id}`}
                  className="flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-stone-800 transition-colors"
                >
                  <span>Book Service</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
