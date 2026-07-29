"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Search, SlidersHorizontal, Star } from "lucide-react";
import { useMemo, useState } from "react";

import {
  serviceCategories,
  services,
  type ServiceFilter,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";

export function ServicesCatalog() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ServiceFilter>("All Services");

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCategory =
        activeCategory === "All Services" ||
        service.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [service.name, service.category, service.description].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <>
      <section className="border-y border-stone-200/70 bg-white/65 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-md">
              <span className="sr-only">Search services</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search AC, plumbing, appliances..."
                className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-12 pr-4 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </label>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:justify-end">
              <span className="mr-1 hidden shrink-0 items-center gap-1.5 text-xs font-semibold text-stone-500 sm:flex">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </span>
              {serviceCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "h-10 shrink-0 rounded-full px-4 text-xs font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200",
                    activeCategory === category
                      ? "bg-stone-900 text-white shadow-sm"
                      : "border border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:text-amber-700",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-700">
              {filteredServices.length} trusted options
            </p>
            <h2 className="mt-1 text-2xl font-bold text-stone-900 sm:text-3xl">
              Find the right expert
            </h2>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-6 text-stone-500 md:block">
            Clear starting prices, verified professionals, and service guarantees
            on every visit.
          </p>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <article
                key={service.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-stone-200/80 bg-white/90 shadow-[0_14px_40px_-28px_rgba(41,37,36,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_22px_50px_-25px_rgba(180,83,9,0.28)]"
              >
                <Link
                  href={`/services/${service.id}`}
                  className="relative block aspect-[4/3] overflow-hidden bg-stone-100"
                  aria-label={`View ${service.name}`}
                >
                  <Image
                    src={service.image}
                    alt={`${service.name} professional at work`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-stone-800 shadow-sm backdrop-blur">
                    {service.badge}
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-stone-950/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                    {service.category}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-stone-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {service.rating}
                      <span className="font-normal text-stone-400">
                        ({service.reviews})
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-stone-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      {service.duration}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-stone-900">
                    <Link
                      href={`/services/${service.id}`}
                      className="outline-none hover:text-amber-700 focus-visible:text-amber-700"
                    >
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">
                    {service.description}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-stone-100 pt-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-stone-400">
                        {service.priceLabel}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-stone-900">
                          ${service.price}
                        </span>
                        {service.originalPrice ? (
                          <span className="text-xs text-stone-400 line-through">
                            ${service.originalPrice}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <Link
                      href={`/services/${service.id}`}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3.5 text-xs font-bold text-stone-950 transition hover:bg-amber-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
                    >
                      View details
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white/60 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-stone-900">
              No matching services
            </h3>
            <p className="mt-2 max-w-sm text-sm text-stone-500">
              Try a broader search or reset the category to see every available
              service.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All Services");
              }}
              className="mt-5 rounded-lg bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}
