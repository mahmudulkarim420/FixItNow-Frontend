"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Clock3,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  cancelBooking,
  createBooking,
  createCheckoutSession,
  getBookingById,
  getUserBookings,
} from "@/lib/bookings-payments-api";
import { fetchServices, fetchTechnicianProfile, mapApiServiceToUI } from "@/lib/services-api";
import type { RepairService } from "@/lib/mock-services-data";
import { cn } from "@/lib/utils";
import type { Booking, TechnicianProfile } from "@/types";

interface ServiceDetailProps {
  service: RepairService;
  isAuthenticated?: boolean;
}

const AVAILABLE_TIME_SLOTS = [
  "09:00-11:00",
  "10:00-12:00",
  "11:00-13:00",
  "14:00-16:00",
  "16:00-18:00",
];

export function ServiceDetail({ service, isAuthenticated = false }: ServiceDetailProps) {
  const router = useRouter();

  // Booking Modal & Active Booking States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("10:00-12:00");
  const [contactNumber, setContactNumber] = useState("+8801700000000");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirectingPayment, setIsRedirectingPayment] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [needAuth, setNeedAuth] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Dynamic Data States
  const [relatedServices, setRelatedServices] = useState<RepairService[]>([]);
  const [techProfile, setTechProfile] = useState<TechnicianProfile | null>(null);

  // Fetch User Bookings to check if user already has an active booking for this service
  const refreshActiveBooking = useCallback(() => {
    getUserBookings()
      .then((bookings) => {
        if (!Array.isArray(bookings)) return;
        const found = bookings.find(
          (b) =>
            (b.serviceId === service.id || b.service?.id === service.id) &&
            b.status !== "COMPLETED" &&
            b.status !== "CANCELLED" &&
            b.status !== "DECLINED"
        );
        setActiveBooking(found || null);
      })
      .catch(() => {
        /* Unauthenticated or fetch error */
      });
  }, [service.id]);

  const { user: authUser } = useAuth();
  const isAuthed = isAuthenticated || Boolean(authUser);

  useEffect(() => {
    if (isAuthed) {
      refreshActiveBooking();
    }
  }, [isAuthed, refreshActiveBooking]);

  // Load Related Services from Backend
  useEffect(() => {
    fetchServices({ limit: 4 })
      .then((res) => {
        if (res?.data) {
          const mapped = res.data
            .filter((s) => s.id !== service.id)
            .slice(0, 3)
            .map(mapApiServiceToUI);
          setRelatedServices(mapped);
        }
      })
      .catch(() => {
        /* Fallback handled gracefully */
      });
  }, [service.id]);

  // Fetch Real Technician Profile from Backend if technicianId exists on service
  useEffect(() => {
    if (service.technician?.id) {
      fetchTechnicianProfile(service.technician.id)
        .then((profile) => {
          if (profile) setTechProfile(profile);
        })
        .catch(() => null);
    }
  }, [service.technician?.id]);

  // Polling for Booking Acceptance / Status Transition
  useEffect(() => {
    const currentBookingId = createdBooking?.id || activeBooking?.id;
    if (!currentBookingId || !isModalOpen) return;

    const interval = setInterval(async () => {
      try {
        const updated = await getBookingById(currentBookingId);
        if (updated) {
          if (createdBooking) setCreatedBooking(updated);
          if (activeBooking) setActiveBooking(updated);
        }
      } catch {
        /* Ignore background polling errors */
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [createdBooking, activeBooking, isModalOpen]);

  // Manual Status Check Handler
  const handleManualStatusCheck = async (bookingId: string) => {
    setIsCheckingStatus(true);
    setBookingError(null);
    try {
      const updated = await getBookingById(bookingId);
      if (updated) {
        if (createdBooking) setCreatedBooking(updated);
        if (activeBooking) setActiveBooking(updated);
      }
    } catch {
      setBookingError("Could not retrieve updated booking status.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Profile data resolution
  const techUser = techProfile?.user;
  const techName = techUser?.name || service.technician.name || "Certified Technician";
  const techEmail = techUser?.email || null;
  const techLocation = techProfile?.location || "Local District Field Tech";
  const techExperience = techProfile?.experience
    ? `${techProfile.experience} Years Exp.`
    : service.technician.experience || "5+ Years Exp.";
  const techHourlyRate = techProfile?.hourlyRate || null;
  const techSkills = techProfile?.skills || [service.category, "Repair Specialist"];
  const techBio = techProfile?.bio || service.technician.bio;
  const techRating = techProfile?.averageRating || service.technician.rating || 5.0;
  const techIsVerified = techProfile ? techProfile.isVerified : true;

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReasonInput, setCancelReasonInput] = useState("");
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  // Handle Booking Cancellation
  const handleCancelBooking = async (bookingId: string) => {
    setIsCancelling(true);
    setBookingError(null);
    try {
      await cancelBooking(bookingId, cancelReasonInput || "Customer requested cancellation");
      setActiveBooking(null);
      setCreatedBooking(null);
      setShowCancelPrompt(false);
      setCancelReasonInput("");
      setIsModalOpen(false);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setBookingError(errorObj?.message || "Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle Form Submission for Creating Booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeBooking) {
      setBookingError("You already have an active booking for this service.");
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);
    setNeedAuth(false);

    try {
      const formattedDate = scheduledDate.split("T")[0];
      const newBooking = await createBooking({
        serviceId: service.id,
        scheduledDate: formattedDate,
        timeSlot,
        contactNumber,
      });
      setCreatedBooking(newBooking);
      setActiveBooking(newBooking);
    } catch (err: unknown) {
      const errorObj = err as { statusCode?: number; message?: string };
      if (errorObj?.statusCode === 401) {
        setNeedAuth(true);
        setBookingError("Please log in as a Customer to complete your service booking.");
      } else {
        setBookingError(errorObj?.message || "Failed to create booking request. Please check input values.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Stripe Payment Redirect
  const handleProceedToPayment = async (bookingId: string) => {
    setIsRedirectingPayment(true);
    setBookingError(null);

    try {
      const checkoutRes = await createCheckoutSession(bookingId);
      if (checkoutRes && checkoutRes.url) {
        window.location.href = checkoutRes.url;
      } else {
        throw new Error("No checkout URL returned from payment server.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setBookingError(errorObj?.message || "Payment checkout failed. Ensure technician has accepted the booking.");
      setIsRedirectingPayment(false);
    }
  };

  const currentDisplayBooking = createdBooking || activeBooking;

  return (
    <div className="min-h-screen bg-[#F9F7F2] dark:bg-slate-950 text-stone-900 dark:text-slate-100 selection:bg-amber-200 selection:text-amber-950 transition-colors duration-200">
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-500 dark:text-slate-400 transition hover:text-amber-700 dark:hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span>Back to all services</span>
        </Link>

        {/* Banner if User Already Has Active Booking for this Service */}
        {activeBooking ? (
          <div className="mt-6 rounded-3xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/90 dark:bg-amber-950/40 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-stone-950 shadow-2xs">
                  <Clock className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      Existing Booking Detected
                    </span>
                    <span className="rounded-full bg-amber-200/90 dark:bg-amber-900/80 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-950 dark:text-amber-200">
                      Status: {activeBooking.status}
                    </span>
                  </div>
                  <h2 className="mt-0.5 text-base font-extrabold text-stone-900 dark:text-slate-100">
                    You already have an active booking for this service!
                  </h2>
                  <p className="mt-1 text-xs text-stone-700 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
                    Scheduled for <strong>{activeBooking.scheduledDate}</strong> ({activeBooking.timeSlot}). You cannot order the same service again until your active booking is completed or cancelled.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeBooking.status === "ACCEPTED" ? (
                  <button
                    type="button"
                    onClick={() => handleProceedToPayment(activeBooking.id)}
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 transition shadow-xs cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Pay Now</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-stone-800 dark:hover:bg-amber-400 transition cursor-pointer"
                  >
                    <span>View Booking Status</span>
                    <ArrowRight className="h-4 w-4 text-amber-400 dark:text-slate-950" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          {/* Main Detail Content */}
          <div>
            <div className="overflow-hidden rounded-3xl border border-white dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-[0_20px_60px_-35px_rgba(41,37,36,0.45)] dark:shadow-black/40">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-stone-100 dark:bg-slate-800 sm:aspect-[16/8]">
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
                    <span className="rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-stone-950 shadow-2xs">
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
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Verified Service Package</span>
              </div>
              <h1 className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-stone-950 dark:text-slate-100">
                {service.name}
              </h1>
              <p className="mt-4 text-sm leading-7 text-stone-600 dark:text-slate-300 sm:text-base">
                {service.longDescription}
              </p>
            </div>

            <div className="mt-10 grid gap-6 border-t border-stone-200/80 dark:border-slate-800 pt-8 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 p-5 backdrop-blur-md">
                <h2 className="text-base font-extrabold text-stone-900 dark:text-slate-100 flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-600 dark:text-amber-400" /> What&apos;s Included
                </h2>
                <ul className="mt-4 space-y-3">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-xs sm:text-sm leading-6 text-stone-600 dark:text-slate-300 font-medium"
                    >
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 p-5 backdrop-blur-md">
                <h2 className="text-base font-extrabold text-stone-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Why FixItNow Guarantee
                </h2>
                <ul className="mt-4 space-y-3">
                  {service.features.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-xs sm:text-sm leading-6 text-stone-600 dark:text-slate-300 font-medium"
                    >
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-900 dark:bg-amber-500 text-white dark:text-slate-950">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Dynamic Assigned Technician Profile Card */}
            <div className="mt-10 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 shadow-md backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={service.technician.image}
                    alt={techName}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        Assigned Technician
                      </span>
                      {techIsVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:text-amber-300">
                          <Check className="h-3 w-3 text-amber-600 dark:text-amber-400" /> Verified Pro
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-0.5 text-lg font-extrabold text-stone-900 dark:text-slate-100">
                      {techName}
                    </h2>
                    {techEmail ? (
                      <p className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                        {techEmail}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-900 dark:text-slate-100 sm:justify-end">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{techRating} Rating</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Technician Details */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs text-stone-600 dark:text-slate-300 font-medium pt-1">
                {techBio ? (
                  <div className="sm:col-span-2 rounded-xl bg-stone-50/80 dark:bg-slate-800/80 p-3 border border-stone-100 dark:border-slate-700">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-400 mb-1">
                      Technician Bio
                    </p>
                    <p className="text-stone-700 dark:text-slate-200 leading-relaxed">{techBio}</p>
                  </div>
                ) : null}

                <div className="flex items-center gap-2 rounded-xl bg-stone-50/70 dark:bg-slate-800/70 p-3 border border-stone-100 dark:border-slate-700">
                  <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-slate-400 block">Location</span>
                    <span className="font-bold text-stone-900 dark:text-slate-100">{techLocation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-stone-50/70 dark:bg-slate-800/70 p-3 border border-stone-100 dark:border-slate-700">
                  <Clock3 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-slate-400 block">Experience & Rate</span>
                    <span className="font-bold text-stone-900 dark:text-slate-100">
                      {techExperience} {techHourlyRate ? `· $${techHourlyRate}/hr` : ""}
                    </span>
                  </div>
                </div>

                {techSkills && techSkills.length > 0 ? (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase text-stone-400 dark:text-slate-400 block mb-1.5">Trade Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {techSkills.map((sk) => (
                        <span
                          key={sk}
                          className="rounded-lg bg-stone-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-stone-800 dark:text-slate-200 border border-stone-200/60 dark:border-slate-700"
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
              <div className="mt-14 border-t border-stone-200/80 dark:border-slate-800 pt-10">
                <h3 className="text-xl font-extrabold text-stone-900 dark:text-slate-100 mb-6">
                  Similar Repair Services
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
                  {relatedServices.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/services/${rel.id}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-2xs hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-md transition"
                    >
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-slate-800 mb-3">
                        <Image
                          src={rel.image}
                          alt={rel.name}
                          fill
                          sizes="200px"
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <p className="text-xs font-bold text-stone-900 dark:text-slate-100 line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                        {rel.name}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs font-extrabold">
                        <span className="text-amber-800 dark:text-amber-400">${rel.price}</span>
                        <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-slate-100" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sticky Pricing & Booking Action Sidebar */}
          <aside className="sticky top-28 rounded-3xl border border-stone-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_20px_55px_-35px_rgba(41,37,36,0.45)] dark:shadow-black/40">
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 dark:border-slate-800 pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-slate-400">
                  {service.priceLabel}
                </p>
                <p className="mt-1 text-4xl font-black text-stone-950 dark:text-slate-100">
                  ${service.price}
                </p>
              </div>
              <span className="rounded-full bg-amber-100 dark:bg-amber-950/80 px-3 py-1.5 text-xs font-extrabold text-amber-800 dark:text-amber-300">
                Verified Price
              </span>
            </div>

            <div className="space-y-4 py-5 text-xs font-semibold text-stone-600 dark:text-slate-300">
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Available in your neighborhood</span>
              </p>
              <p className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Backed by 30-day warranty</span>
              </p>
            </div>

            {/* Dynamic Action Button depending on Active Booking status */}
            {activeBooking ? (
              activeBooking.status === "ACCEPTED" ? (
                <button
                  type="button"
                  onClick={() => handleProceedToPayment(activeBooking.id)}
                  disabled={isRedirectingPayment}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-4 text-sm font-extrabold text-white shadow-md shadow-emerald-500/20 transition hover:from-emerald-600 hover:to-emerald-700 cursor-pointer disabled:opacity-50"
                >
                  {isRedirectingPayment ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-white" />
                  )}
                  <span>Pay Now (${service.price})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-4 text-sm font-extrabold text-stone-950 shadow-md shadow-amber-500/20 transition hover:bg-amber-400 cursor-pointer"
                >
                  <span>View Active Booking Status</span>
                  <ArrowRight className="h-4 w-4 text-stone-950" />
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCreatedBooking(null);
                  setBookingError(null);
                  setIsModalOpen(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-4 text-sm font-extrabold text-stone-950 shadow-md shadow-amber-500/20 transition hover:bg-amber-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 cursor-pointer"
              >
                <span>Book Service Now</span>
                <ArrowRight className="h-4 w-4 text-stone-950" />
              </button>
            )}

            <p className="mt-3 text-center text-[11px] leading-5 text-stone-400 dark:text-slate-400 font-medium">
              Payment is unlocked after a technician accepts your booking.
            </p>
          </aside>
        </div>
      </main>

      {/* Interactive Booking & Status Progression Modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-slate-800 text-stone-900 dark:text-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
              }}
              className="absolute right-4 top-4 rounded-full p-2 text-stone-400 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-700 dark:hover:text-slate-200 cursor-pointer transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {!currentDisplayBooking ? (
              /* STEP 1: Booking Input Form */
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Step 1 of 2
                    </p>
                    <h2 className="text-xl font-extrabold text-stone-900 dark:text-slate-100">
                      Schedule Service Booking
                    </h2>
                  </div>
                </div>

                <p className="mt-3 text-xs text-stone-500 dark:text-slate-400">
                  Reserving <strong className="text-stone-800 dark:text-slate-200">{service.name}</strong> (${service.price}). Select your preferred visit date & time slot.
                </p>

                {bookingError ? (
                  <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-red-50 dark:bg-red-950/40 p-3.5 text-xs text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/60">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <span>{bookingError}</span>
                    </div>
                    {needAuth ? (
                      <button
                        type="button"
                        onClick={() => router.push(`/login?redirect=/services/${service.id}`)}
                        className="mt-1 self-start rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition"
                      >
                        Log in to Continue →
                      </button>
                    ) : null}
                  </div>
                ) : null}

                <form onSubmit={handleBookingSubmit} className="mt-5 space-y-4">
                  {/* Scheduled Date */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-600 dark:text-slate-300 mb-1">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="h-11 w-full rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 px-3 text-xs font-bold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-600 dark:text-slate-300 mb-1.5">
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {AVAILABLE_TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={cn(
                            "flex items-center justify-center gap-1 rounded-xl px-3 py-2.5 text-xs font-extrabold border transition cursor-pointer",
                            timeSlot === slot
                              ? "bg-amber-500 text-stone-950 border-amber-400 shadow-2xs"
                              : "bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700"
                          )}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-stone-600 dark:text-slate-300 mb-1">
                      Contact Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-slate-500" />
                      <input
                        type="tel"
                        required
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="+8801700000000"
                        className="h-11 w-full rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 pl-9 pr-3 text-xs font-bold text-stone-900 dark:text-slate-100 outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-500 text-white dark:text-slate-950 px-5 py-3.5 text-xs font-extrabold transition hover:bg-stone-800 dark:hover:bg-amber-400 disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-amber-400 dark:text-slate-950" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm Booking Request</span>
                          <ArrowRight className="h-4 w-4 text-amber-400 dark:text-slate-950" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* STEP 2: Booking Status Tracker & Payment Gate */
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Booking Tracker
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleManualStatusCheck(currentDisplayBooking.id)}
                    disabled={isCheckingStatus}
                    className="flex items-center gap-1.5 rounded-xl bg-stone-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", isCheckingStatus ? "animate-spin text-amber-600 dark:text-amber-400" : "")} />
                    <span>Check Status</span>
                  </button>
                </div>

                <div className="mt-4 text-center">
                  {/* Dynamic Status Badges */}
                  {currentDisplayBooking.status === "REQUESTED" ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-950/80 px-3.5 py-1 text-xs font-black uppercase text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-2xs animate-pulse">
                      <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                      <span>Status: Waiting for Technician Acceptance</span>
                    </div>
                  ) : currentDisplayBooking.status === "ACCEPTED" ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1 text-xs font-black uppercase text-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                      <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                      <span>Status: ACCEPTED by Technician</span>
                    </div>
                  ) : currentDisplayBooking.status === "PAID" ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-950/80 px-3.5 py-1 text-xs font-black uppercase text-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800 shadow-2xs">
                      <ShieldCheck className="h-4 w-4 text-sky-700 dark:text-sky-400" />
                      <span>Status: PAID & SCHEDULED</span>
                    </div>
                  ) : currentDisplayBooking.status === "IN_PROGRESS" ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-950/80 px-3.5 py-1 text-xs font-black uppercase text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-2xs animate-pulse">
                      <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                      <span>Status: REPAIR IN PROGRESS</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 dark:bg-slate-800 px-3.5 py-1 text-xs font-black uppercase text-stone-800 dark:text-slate-200">
                      <span>Status: {currentDisplayBooking.status}</span>
                    </div>
                  )}

                  <h2 className="mt-4 text-2xl font-extrabold text-stone-900 dark:text-slate-100">
                    {currentDisplayBooking.status === "ACCEPTED"
                      ? "Technician Accepted Your Booking!"
                      : currentDisplayBooking.status === "PAID"
                      ? "Booking Paid & Scheduled!"
                      : currentDisplayBooking.status === "IN_PROGRESS"
                      ? "Repair Service in Progress"
                      : "Booking Request Received!"}
                  </h2>

                  <p className="mt-2 text-xs text-stone-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                    {currentDisplayBooking.status === "ACCEPTED"
                      ? "A certified technician has accepted your appointment! Complete payment below to lock in your visit."
                      : currentDisplayBooking.status === "PAID"
                      ? "Your payment was successful and your appointment is scheduled for your technician visit."
                      : currentDisplayBooking.status === "IN_PROGRESS"
                      ? "The technician is currently performing the repair service."
                      : "Your request is currently waiting for a technician to accept. Once accepted by the technician, the payment button below will unlock automatically."}
                  </p>

                  <div className="mt-4 rounded-2xl bg-stone-50 dark:bg-slate-800/80 p-4 border border-stone-200/80 dark:border-slate-700 text-left text-xs space-y-2 font-medium">
                    <div className="flex justify-between">
                      <span className="text-stone-400 dark:text-slate-400">Service:</span>
                      <strong className="text-stone-900 dark:text-slate-100">{service.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400 dark:text-slate-400">Scheduled Visit:</span>
                      <strong className="text-stone-900 dark:text-slate-100">
                        {currentDisplayBooking.scheduledDate} ({currentDisplayBooking.timeSlot})
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400 dark:text-slate-400">Total Price:</span>
                      <strong className="text-amber-700 dark:text-amber-400 text-sm font-black">${service.price}</strong>
                    </div>
                  </div>

                  {bookingError ? (
                    <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-xs text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/60 flex items-start gap-2 text-left">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <span>{bookingError}</span>
                    </div>
                  ) : null}

                  {/* Payment Button & Cancellation Gate */}
                  <div className="mt-6 space-y-3">
                    {currentDisplayBooking.status === "ACCEPTED" ? (
                      <button
                        type="button"
                        disabled={isRedirectingPayment}
                        onClick={() => handleProceedToPayment(currentDisplayBooking.id)}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-4 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-600 hover:to-emerald-700 cursor-pointer disabled:opacity-50"
                      >
                        {isRedirectingPayment ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                            <span>Redirecting to Stripe...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 text-white" />
                            <span>Proceed to Online Payment (Stripe)</span>
                            <ArrowRight className="h-4 w-4 text-white" />
                          </>
                        )}
                      </button>
                    ) : currentDisplayBooking.status === "PAID" ? (
                      <div className="flex items-center justify-center gap-2 rounded-2xl bg-sky-50 dark:bg-sky-950/60 p-3.5 text-xs font-bold text-sky-900 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                        <Check className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                        <span>Payment Received (Paid & Scheduled)</span>
                      </div>
                    ) : currentDisplayBooking.status === "IN_PROGRESS" ? (
                      <div className="flex items-center justify-center gap-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 p-3.5 text-xs font-bold text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 animate-spin" />
                        <span>Repair Work In Progress</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          type="button"
                          disabled
                          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-stone-100 dark:bg-slate-800 px-5 py-4 text-xs font-extrabold text-stone-400 dark:text-slate-500 border border-stone-200/80 dark:border-slate-700 cursor-not-allowed"
                        >
                          <Lock className="h-4 w-4 text-stone-400 dark:text-slate-500" />
                          <span>Payment Locked (Waiting for Acceptance)</span>
                        </button>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center justify-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin text-amber-600 dark:text-amber-400" />
                          <span>Auto-refreshing status every few seconds...</span>
                        </p>
                      </div>
                    )}

                    {/* Cancellation Action (Allowed if not IN_PROGRESS and not COMPLETED) */}
                    {currentDisplayBooking.status !== "IN_PROGRESS" &&
                    currentDisplayBooking.status !== "COMPLETED" &&
                    currentDisplayBooking.status !== "CANCELLED" &&
                    currentDisplayBooking.status !== "DECLINED" ? (
                      showCancelPrompt ? (
                        <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-left space-y-3">
                          <p className="text-xs font-bold text-rose-900 dark:text-rose-300">
                            Provide cancellation reason:
                          </p>
                          <textarea
                            rows={2}
                            value={cancelReasonInput}
                            onChange={(e) => setCancelReasonInput(e.target.value)}
                            placeholder="E.g., Plans changed, date mistake..."
                            className="w-full rounded-xl border border-rose-200 dark:border-rose-800 p-2.5 text-xs text-stone-900 dark:text-slate-100 font-medium outline-none focus:border-rose-500 bg-white dark:bg-slate-800"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowCancelPrompt(false)}
                              className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              disabled={isCancelling}
                              onClick={() => handleCancelBooking(currentDisplayBooking.id)}
                              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                              {isCancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                              <span>Confirm Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowCancelPrompt(true)}
                          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 px-4 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition cursor-pointer"
                        >
                          <span>Cancel This Service Booking</span>
                        </button>
                      )
                    ) : null}

                    <button
                      type="button"
                      onClick={() => router.push("/dashboard/customer/bookings")}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-xs font-bold text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      <span>View All My Bookings in Dashboard</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ServiceNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F9F7F2] dark:bg-slate-950 p-6 text-center transition-colors duration-200">
      <div className="max-w-md rounded-3xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xs">
        <Users className="mx-auto h-12 w-12 text-amber-600 dark:text-amber-400" />
        <h1 className="mt-4 text-2xl font-extrabold text-stone-900 dark:text-slate-100">Service Not Found</h1>
        <p className="mt-2 text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
          The requested service ID may have been updated or removed. Please explore our full catalog of home repair services.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-stone-900 dark:bg-amber-500 dark:text-slate-950 px-5 py-3 text-xs font-bold text-white hover:bg-stone-800 dark:hover:bg-amber-400 transition"
        >
          <span>Browse All Services</span>
          <ArrowRight className="h-4 w-4 text-amber-400 dark:text-slate-950" />
        </Link>
      </div>
    </div>
  );
}
