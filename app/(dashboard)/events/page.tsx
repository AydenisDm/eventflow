import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, MapPin, Users } from "lucide-react";

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-500/10 text-slate-500",
  OPEN: "bg-emerald-500/10 text-emerald-500",
  CLOSED: "bg-amber-500/10 text-amber-500",
  COMPLETED: "bg-blue-500/10 text-blue-500",
  CANCELLED: "bg-red-500/10 text-red-500",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: { _count: { select: { participants: true } } },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">Manage all your organization's events.</p>
        </div>
        <Link
          href="/events/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" />
          New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No events yet. Create your first event to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition space-y-3 block"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{event.name}</h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[event.status]}`}
                >
                  {event.status}
                </span>
              </div>
              {event.venue && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.venue}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {event._count.participants} / {event.maxCapacity ?? "\u221e"} registered
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                {formatDate(event.startDate)} – {formatDate(event.endDate)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
