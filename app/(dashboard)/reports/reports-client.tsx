"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, TrendingUp, Users, DollarSign, CalendarCheck } from "lucide-react";

const COLORS = ["#34d399", "#f87171", "#fbbf24"];

interface ReportsData {
  registrationsByMonth: { month: string; registrations: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  attendanceBreakdown: { name: string; value: number }[];
  totalParticipants: number;
  totalRevenue: number;
  attendanceRate: number;
}

export function ReportsClient({ data }: { data: ReportsData }) {
  const summaryCards = [
    { label: "Total Registrations", value: data.totalParticipants.toLocaleString(), icon: Users },
    { label: "Total Revenue", value: `$${data.totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: "Avg. Attendance Rate", value: `${data.attendanceRate}%`, icon: CalendarCheck },
    { label: "Growth Rate", value: "—", icon: TrendingUp },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Reports & Analytics</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Insights across registrations, revenue, and attendance
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-zinc-700 text-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-800 transition">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">{c.label}</p>
              <c.icon className="h-4 w-4 text-zinc-500" />
            </div>
            <p className="text-2xl font-semibold text-white mt-2">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="text-sm font-medium text-white mb-4">Registrations Over Time</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.registrationsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 8 }}
                labelStyle={{ color: "#e4e4e7" }}
              />
              <Bar dataKey="registrations" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="text-sm font-medium text-white mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 8 }}
                labelStyle={{ color: "#e4e4e7" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-white mb-4">Attendance Breakdown</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={220} className="max-w-xs">
              <PieChart>
                <Pie
                  data={data.attendanceBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {data.attendanceBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {data.attendanceBreakdown.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-zinc-300">{item.name}</span>
                  <span className="text-zinc-500">({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
