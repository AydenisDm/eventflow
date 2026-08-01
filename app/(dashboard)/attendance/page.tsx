import { getAttendanceRecords } from "@/lib/actions";
import { AttendanceClient } from "./attendance-client";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const participants = await getAttendanceRecords();

  const records = participants.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    eventName: p.event.name,
    arrivalStatus: p.arrivalStatus,
    checkedInAt: p.checkedInAt,
  }));

  return (
    <div className="p-6">
      <AttendanceClient records={records} />
    </div>
  );
}
