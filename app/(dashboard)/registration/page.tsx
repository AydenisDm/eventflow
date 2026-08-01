"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  event: z.string().min(1, "Please select an event"),
  ticketType: z.string().min(1, "Please select a ticket type"),
  notes: z.string().optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

const events = ["Tech Summit 2025", "Product Launch", "Design Conference", "Founders Meetup"];
const ticketTypes = ["General Admission", "VIP", "Speaker", "Student"];

export default function RegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationForm) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.log("New registration:", data);
    setSubmitted(true);
    reset();
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">New Registration</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Register a new participant for an upcoming event
        </p>
      </div>

      {submitted && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-800 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Registration submitted successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
          <input
            {...register("fullName")}
            type="text"
            placeholder="Jane Doe"
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
          {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="jane@example.com"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Phone</label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="+359 88 123 4567"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
            {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Event</label>
            <select
              {...register("event")}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
              defaultValue=""
            >
              <option value="" disabled>
                Select an event
              </option>
              {events.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            {errors.event && <p className="text-xs text-red-400 mt-1">{errors.event.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Ticket Type</label>
            <select
              {...register("ticketType")}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-600"
              defaultValue=""
            >
              <option value="" disabled>
                Select ticket type
              </option>
              {ticketTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.ticketType && <p className="text-xs text-red-400 mt-1">{errors.ticketType.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Notes (optional)</label>
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="Dietary restrictions, accessibility needs, etc."
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}
