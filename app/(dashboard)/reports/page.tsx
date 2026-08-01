import { getReportStats, getRegistrationsByMonth, getRevenueByMonth, getAttendanceBreakdown } from "@/lib/actions";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  const [stats, registrationsByMonth, revenueByMonth, attendanceBreakdown] = await Promise.all([
    getReportStats(),
    getRegistrationsByMonth(),
    getRevenueByMonth(),
    getAttendanceBreakdown(),
  ]);

  return (
    <ReportsClient
      data={{
        registrationsByMonth,
        revenueByMonth,
        attendanceBreakdown,
        totalParticipants: stats.totalParticipants,
        totalRevenue: stats.totalRevenue,
        attendanceRate: stats.attendanceRate,
      }}
    />
  );
}
