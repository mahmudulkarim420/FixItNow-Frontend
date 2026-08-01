"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 700);
  }

  if (status === "sent") {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center px-6 text-center" role="status">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700"><CheckCircle2 className="h-8 w-8" /></span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Message received</p>
        <h2 className="mt-2 text-2xl font-extrabold text-stone-900">Thanks for reaching out.</h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-stone-500">This is a UI demo, but your form worked perfectly. A real FixItNow team member would follow up within one business day.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-amber-300 hover:text-amber-700">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-8">
      <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Send a note</p><h2 className="mt-2 text-2xl font-extrabold text-stone-900">How can we help?</h2><p className="mt-2 text-sm leading-6 text-stone-500">Tell us a little about what you need and we&apos;ll point you in the right direction.</p></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block"><span className="mb-2 block text-xs font-bold text-stone-700">Your name</span><input required name="name" autoComplete="name" placeholder="Alex Morgan" className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50/70 px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100" /></label>
        <label className="block"><span className="mb-2 block text-xs font-bold text-stone-700">Email address</span><input required type="email" name="email" autoComplete="email" placeholder="alex@example.com" className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50/70 px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100" /></label>
      </div>
      <label className="mt-5 block"><span className="mb-2 block text-xs font-bold text-stone-700">What can we help with?</span><select name="topic" defaultValue="" className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50/70 px-4 text-sm text-stone-700 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"><option value="" disabled>Choose a topic</option><option>Booking a service</option><option>Existing appointment</option><option>Joining as a professional</option><option>Something else</option></select></label>
      <label className="mt-5 block"><span className="mb-2 block text-xs font-bold text-stone-700">Message</span><textarea required name="message" rows={6} placeholder="Share the details here..." className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100" /></label>
      <button type="submit" disabled={status === "sending"} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-stone-800 disabled:cursor-wait disabled:opacity-70 sm:w-auto">{status === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <>Send message <Send className="h-4 w-4 text-amber-400" /></>}</button>
    </form>
  );
}
