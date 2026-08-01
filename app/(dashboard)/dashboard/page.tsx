import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  UserCheck,
  Clock,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Building2,
  Armchair,
} from "lucide-react";

async function getStats() {
  const participants = await prisma.participant.findMany();
  const totalParticipants = participants.length;
  const checkedIn = participants.filter((p) => p.arrivalStatus === "CHECKED_IN").length;
  const pending = participants.filter((p) => p.arrivalStatus === "EXPECTED").length;
  const paid = participants.filter((p) => p.paymentStatus === "PAID").length;
  const outstanding = participants.reduce(
    (sum, p) => sum + Math.max(0, p.amountDue - p.amountPaid),
    0
  );
  const revenue = participants.reduce((sum, p) => sum + p.amountPaid, 0);
  const event = await prisma.event.findFirst();
  const capacity = event?.maxCapacity ?? 0;
  const available = Math.max(0, capacity - totalParticipants);

  return {
    totalParticipants,
    checkedIn,
    pending,
    paid,
    outstanding,
    revenue,
    capacity,
    available,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Participants", value: stats.totalParticipants, icon: Users },
    { label: "Checked In", value: stats.checkedIn, icon: UserCheck },
    { label: "Pending Arrival", value: stats.pending, icon: Clock },
    { label: "Paid", value: stats.paid, icon: DollarSign },
    { label: "Outstanding", value: formatCurrency(stats.outstanding), icon: AlertCircle },
    { label: "Revenue", value: formatCurrency(stats.revenue), icon: TrendingUp },
    { label: "Capacity", value: stats.capacity, icon: Building2 },
    { label: "Available Seats", value: stats.available, icon: Armchair },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your events and participants.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 text-2xl font-bold">{card.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
