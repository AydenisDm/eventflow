"use client";

import { useState, useTransition } from "react";
import { Search, CheckCircle2, XCircle, QrCode, Clock } from "lucide-react";
import { toggleCheckIn } from "@/lib/actions";

interface AttendanceRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  eventName: string;
  arrivalStatus: string;
  checkedInAt: Date | null;
}

export function AttendanceClient({ records: initialRecords }: { records: AttendanceRecord[] }) {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = records.filter(
    (r) =>
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      (r.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              arrivalStatus: r.arrivalStatus === "CHECKED_IN" ? "EXPECTED" : "CHECKED_IN",
              checkedInAt: r.arrivalStatus === "CHECKED_IN" ? null : new Date(),
            }
          : r
      )
    );
    startTransition(async () => {
      await toggleCheckIn(id);
    });
  };

  const checkedInCount = records.filter((r) => r.arrivalStatus === "CHECKED_IN").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Attendance</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track and manage check-ins for your events
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition">
          <QrCode className="h-4 w-4" />
          Scan QR Code
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Total Registered</p>
          <p className="text-2xl font-semibold text-white mt-1">{records.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Checked In</p>
          <p className="text-2xl font-semibold text-emerald-400 mt-1">{checkedInCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Pending</p>
          <p className="text-2xl font-semibold text-amber-400 mt-1">
            {records.length - checkedInCount}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="p-4 border-b border-zinc-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-400 border-b border-zinc-800">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Check-in Time</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/70 transition">
                <td className="px-4 py-3 text-white">{r.firstName} {r.lastName}</td>
                <td className="px-4 py-3 text-zinc-400">{r.email ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-400">{r.eventName}</td>
                <td className="px-4 py-3">
                  {r.arrivalStatus === "CHECKED_IN" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-1 text-xs font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Checked In
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 text-zinc-400 px-2 py-1 text-xs font-medium">
                      <XCircle className="h-3.5 w-3.5" /> Not Checked In
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  {r.checkedInAt ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />{" "}
                      {new Date(r.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleToggle(r.id)}
                    disabled={isPending}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                      r.arrivalStatus === "CHECKED_IN"
                        ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        : "bg-white text-black hover:bg-zinc-200"
                    }`}
                  >
                    {r.arrivalStatus === "CHECKED_IN" ? "Undo" : "Check In"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
