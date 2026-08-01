import { getPayments, getPaymentSummary } from "@/lib/actions";
import { PaymentsClient } from "./payments-client";

export default async function PaymentsPage() {
  const [records, summary] = await Promise.all([getPayments(), getPaymentSummary()]);

  const payments = records.map((p) => {
    const participant = p.participant;
    const status: "paid" | "pending" | "failed" = p.isRefund
      ? "failed"
      : participant?.paymentStatus === "PAID"
      ? "paid"
      : participant?.paymentStatus === "UNPAID"
      ? "pending"
      : "paid";

    return {
      id: p.id,
      participant: participant ? `${participant.firstName} ${participant.lastName}` : "Unknown",
      email: participant?.email ?? "",
      event: participant?.event?.name ?? "",
      amount: p.amount,
      status,
      date: p.paymentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      method: p.method,
    };
  });

  return (
    <div className="p-6">
      <PaymentsClient payments={payments} summary={summary} />
    </div>
  );
}
