"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import {
  ArrivalStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
  RegistrationSource,
} from "@prisma/client";

// ---------- ATTENDANCE ----------

export async function getAttendanceRecords(eventId?: string) {
  return prisma.participant.findMany({
    where: eventId ? { eventId } : undefined,
    include: { event: true },
    orderBy: { registrationDate: "desc" },
  });
}

export async function toggleCheckIn(participantId: string) {
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
  });
  if (!participant) throw new Error("Participant not found");

  const isCurrentlyCheckedIn = participant.arrivalStatus === ArrivalStatus.CHECKED_IN;

  const updated = await prisma.participant.update({
    where: { id: participantId },
    data: isCurrentlyCheckedIn
      ? { arrivalStatus: ArrivalStatus.EXPECTED, checkedInAt: null, checkedInBy: null }
      : { arrivalStatus: ArrivalStatus.CHECKED_IN, checkedInAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      action: isCurrentlyCheckedIn ? "UNDO_CHECK_IN" : "CHECK_IN",
      entity: "Participant",
      entityId: participantId,
    },
  });

  revalidatePath("/attendance");
  return updated;
}

// ---------- PAYMENTS ----------

export async function getPayments() {
  return prisma.payment.findMany({
    include: { participant: { include: { event: true } }, receivedBy: true },
    orderBy: { paymentDate: "desc" },
  });
}

export async function getPaymentSummary() {
  const [paidAgg, participants] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true }, where: { isRefund: false } }),
    prisma.participant.findMany({ select: { amountDue: true, amountPaid: true, paymentStatus: true } }),
  ]);

  const totalRevenue = paidAgg._sum.amount ?? 0;
  const pendingAmount = participants
    .filter((p) => p.paymentStatus !== PaymentStatus.PAID)
    .reduce((sum, p) => sum + Math.max(p.amountDue - p.amountPaid, 0), 0);
  const failedCount = participants.filter((p) => p.paymentStatus === PaymentStatus.UNPAID).length;

  return { totalRevenue, pendingAmount, failedCount };
}

export async function recordPayment(input: {
  participantId: string;
  amount: number;
  method: PaymentMethod;
  transactionRef?: string;
}) {
  const session = await auth();

  const payment = await prisma.payment.create({
    data: {
      participantId: input.participantId,
      amount: input.amount,
      method: input.method,
      transactionRef: input.transactionRef,
      receivedById: session?.user?.id ?? null,
    },
  });

  const participant = await prisma.participant.findUnique({ where: { id: input.participantId } });
  if (participant) {
    const newAmountPaid = participant.amountPaid + input.amount;
    const newStatus: PaymentStatus =
      newAmountPaid >= participant.amountDue
        ? PaymentStatus.PAID
        : newAmountPaid > 0
        ? PaymentStatus.PARTIAL
        : PaymentStatus.UNPAID;

    await prisma.participant.update({
      where: { id: input.participantId },
      data: { amountPaid: newAmountPaid, paymentStatus: newStatus },
    });
  }

  revalidatePath("/payments");
  return payment;
}

// ---------- REGISTRATION ----------

export interface RegistrationInput {
  eventId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  ticketType?: string;
  notes?: string;
}

export async function createRegistration(input: RegistrationInput) {
  const participant = await prisma.participant.create({
    data: {
      eventId: input.eventId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      ticketType: input.ticketType,
      registrationSource: RegistrationSource.STAFF,
    },
  });

  if (input.notes) {
    await prisma.note.create({
      data: {
        participantId: participant.id,
        category: "registration",
        content: input.notes,
      },
    });
  }

  revalidatePath("/registration");
  revalidatePath("/participants");
  return participant;
}

export async function getEventOptions() {
  return prisma.event.findMany({
    select: { id: true, name: true },
    orderBy: { startDate: "desc" },
  });
}

// ---------- USERS ----------

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function inviteUser(input: { name: string; email: string; role: Role; organizationId: string }) {
  const tempPassword = Math.random().toString(36).slice(-10);
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      organizationId: input.organizationId,
      passwordHash,
    },
  });

  revalidatePath("/users");
  return user;
}

export async function updateUserRole(userId: string, role: Role) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/users");
  return updated;
}

// ---------- REPORTS ----------

export async function getReportStats() {
  const [totalParticipants, totalRevenueAgg, checkedInCount, totalCount] = await Promise.all([
    prisma.participant.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { isRefund: false } }),
    prisma.participant.count({ where: { arrivalStatus: ArrivalStatus.CHECKED_IN } }),
    prisma.participant.count(),
  ]);

  const attendanceRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

  return {
    totalParticipants,
    totalRevenue: totalRevenueAgg._sum.amount ?? 0,
    attendanceRate,
  };
}

export async function getRegistrationsByMonth() {
  const participants = await prisma.participant.findMany({
    select: { registrationDate: true },
  });

  const counts: Record<string, number> = {};
  for (const p of participants) {
    const month = p.registrationDate.toLocaleString("en-US", { month: "short" });
    counts[month] = (counts[month] ?? 0) + 1;
  }

  return Object.entries(counts).map(([month, registrations]) => ({ month, registrations }));
}

export async function getRevenueByMonth() {
  const payments = await prisma.payment.findMany({
    select: { paymentDate: true, amount: true },
    where: { isRefund: false },
  });

  const totals: Record<string, number> = {};
  for (const p of payments) {
    const month = p.paymentDate.toLocaleString("en-US", { month: "short" });
    totals[month] = (totals[month] ?? 0) + p.amount;
  }

  return Object.entries(totals).map(([month, revenue]) => ({ month, revenue }));
}

export async function getAttendanceBreakdown() {
  const [checkedIn, noShow, pending] = await Promise.all([
    prisma.participant.count({ where: { arrivalStatus: ArrivalStatus.CHECKED_IN } }),
    prisma.participant.count({ where: { arrivalStatus: ArrivalStatus.NO_SHOW } }),
    prisma.participant.count({ where: { arrivalStatus: ArrivalStatus.EXPECTED } }),
  ]);

  return [
    { name: "Checked In", value: checkedIn },
    { name: "No Show", value: noShow },
    { name: "Pending", value: pending },
  ];
}


// ---------- SETTINGS ----------

export async function getOrganization() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true },
  });
  return user?.organization ?? null;
}

export async function updateOrganization(
  organizationId: string,
  input: { name: string; colorHex?: string; logoUrl?: string }
) {
  const updated = await prisma.organization.update({
    where: { id: organizationId },
    data: {
      name: input.name,
      colorHex: input.colorHex,
      logoUrl: input.logoUrl,
    },
  });
  revalidatePath("/settings");
  return updated;
}

export async function getCurrentUserProfile() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true },
  });
}

export async function updateUserProfile(
  userId: string,
  input: { name: string; avatarUrl?: string }
) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { name: input.name, avatarUrl: input.avatarUrl },
  });
  revalidatePath("/settings");
  revalidatePath("/profile");
  return updated;
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
  await prisma.auditLog.create({
    data: { userId, action: "PASSWORD_CHANGE", entity: "User", entityId: userId },
  });
  return { success: true };
}
