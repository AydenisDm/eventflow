"use client";

import { useState } from "react";
import { Search, DollarSign, Download, CheckCircle2, Clock3, XCircle } from "lucide-react";

interface Payment {
  id: string;
  participant: string;
  email: string;
  event: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
  method: string;
}

const mockPayments: Payment[] = [
  { id: "INV-1001", participant: "Elena Petrova", email: "elena@example.com", event: "Tech Summit 2025", amount: 149, status: "paid", date: "Mar 12, 2025", method: "Visa •••• 4242" },
  { id: "INV-1002", participant: "Ivan Dimitrov", email: "ivan@example.com", event: "Tech Summit 2025", amount: 149, status: "pending", date: "Mar 13, 2025", method: "—" },
  { id: "INV-1003", participant: "Maria Georgieva", email: "maria@example.com", event: "Product Launch", amount: 89, status: "paid", date: "Mar 10, 2025", method: "Mastercard •••• 1187" },
  { id: "INV-1004", participant: "Stoyan Kolev", email: "stoyan@example.com", event: "Product Launch", amount: 89, status: "failed", date: "Mar 11, 2025", method: "Visa •••• 7791" },
  { id: "INV-1005", participant: "Ana Todorova", email: "ana@example.com", event: "Tech Summit 2025", amount: 149, status: "paid", date: "Mar 14, 2025", method: "PayPal" },
];

const statusStyles: Record<Payment["status"], string> = {
  paid: "bg-emerald-500/10 text-emerald-400",
  pending: "bg-amber-500/10 text-amber-400",
  failed: "bg-red-500/10 text-red-400",
};

const statusIcons: Record<Payment["status"], JSX.Element> = {
  paid: <CheckCircle2 className="h-3.5 w-3.5" />,
  pending: <Clock3 className="h-3.5 w-3.5" />,
  failed: <XCircle className="h-3.5 w-3.5" />,
};

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Payment["status"]>("all");

  const filtered = mockPayments.filter((p) => {
    const matchesSearch =
      p.participant.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = mockPayments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = mockPayments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const failedCount = mockPayments.filter((p) => p.status === "failed").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Payments</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track transactions, invoices, and revenue
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-zinc-700 text-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-800 transition">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Total Revenue</p>
          <p className="text-2xl font-semibold text-white mt-1 flex items-center gap-1">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Pending Amount</p>
          <p className="text-2xl font-semibold text-amber-400 mt-1">${pendingAmount.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Failed Transactions</p>
          <p className="text-2xl font-semibold text-red-400 mt-1">{failedCount}</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, email, invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "paid", "pending", "failed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                  filter === s
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-400 border-b border-zinc-800">
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Participant</th>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/70 transition">
                <td className="px-4 py-3 text-white font-mono text-xs">{p.id}</td>
                <td className="px-4 py-3">
                  <div className="text-white">{p.participant}</div>
                  <div className="text-zinc-500 text-xs">{p.email}</div>
                </td>
                <td className="px-4 py-3 text-zinc-400">{p.event}</td>
                <td className="px-4 py-3 text-white">${p.amount}</td>
                <td className="px-4 py-3 text-zinc-400">{p.method}</td>
                <td className="px-4 py-3 text-zinc-400">{p.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium capitalize ${statusStyles[p.status]}`}>
                    {statusIcons[p.status]} {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
