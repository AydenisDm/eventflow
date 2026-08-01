import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getInitials, calculateBalance } from "@/lib/utils";
import { Search, Download, Upload } from "lucide-react";

const arrivalColors: Record<string, string> = {
  EXPECTED: "bg-amber-500/10 text-amber-500",
  CHECKED_IN: "bg-emerald-500/10 text-emerald-500",
  CHECKED_OUT: "bg-slate-500/10 text-slate-500",
  LATE_ARRIVAL: "bg-orange-500/10 text-orange-500",
  NO_SHOW: "bg-red-500/10 text-red-500",
};

const paymentColors: Record<string, string> = {
  UNPAID: "bg-red-500/10 text-red-500",
  PARTIAL: "bg-amber-500/10 text-amber-500",
  PAID: "bg-emerald-500/10 text-emerald-500",
  REFUNDED: "bg-slate-500/10 text-slate-500",
};

export default async function ParticipantsPage() {
  const participants = await prisma.participant.findMany({
    orderBy: { registrationDate: "desc" },
    include: { event: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Participants</h2>
          <p className="text-muted-foreground">Search, filter, and manage all registered participants.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition">
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search participants..."
          className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3">Arrival</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {participants.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                    {getInitials(p.firstName, p.lastName)}
                  </div>
                  {p.firstName} {p.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.phone}</td>
                <td className="px-4 py-3">{p.ticketType ?? "\u2014"}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(p.registrationDate)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${arrivalColors[p.arrivalStatus]}`}>
                    {p.arrivalStatus.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${paymentColors[p.paymentStatus]}`}>
                    {p.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatCurrency(calculateBalance(p.amountDue, p.amountPaid))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {participants.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            No participants registered yet.
          </div>
        )}
      </div>
    </div>
  );
}
