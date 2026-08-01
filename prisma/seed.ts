import { PrismaClient, Role, EventStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.create({
    data: {
      name: "Grace Community Church",
      colorHex: "#6366f1",
    },
  });

  const passwordHash = await bcrypt.hash("Password123!", 10);

  await prisma.user.createMany({
    data: [
      { name: "Alice Admin", email: "admin@eventflow.dev", passwordHash, role: Role.SUPER_ADMIN, organizationId: org.id },
      { name: "Ben Organizer", email: "organizer@eventflow.dev", passwordHash, role: Role.ADMINISTRATOR, organizationId: org.id },
      { name: "Cara Registrar", email: "registrar@eventflow.dev", passwordHash, role: Role.REGISTRATION_STAFF, organizationId: org.id },
      { name: "Dan Checkin", email: "checkin@eventflow.dev", passwordHash, role: Role.CHECKIN_STAFF, organizationId: org.id },
      { name: "Eva Finance", email: "finance@eventflow.dev", passwordHash, role: Role.FINANCE, organizationId: org.id },
    ],
  });

  const event = await prisma.event.create({
    data: {
      organizationId: org.id,
      name: "Annual Conference 2026",
      description: "Our flagship yearly gathering.",
      venue: "Grand Hall",
      address: "123 Main St, Sofia",
      organizer: "Grace Community Church",
      startDate: new Date("2026-09-10"),
      endDate: new Date("2026-09-12"),
      maxCapacity: 500,
      registrationDeadline: new Date("2026-09-01"),
      status: EventStatus.OPEN,
    },
  });

  await prisma.participant.createMany({
    data: [
      {
        eventId: event.id,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+359888000000",
        ticketType: "Standard",
        amountDue: 100,
        amountPaid: 100,
        paymentStatus: "PAID",
      },
      {
        eventId: event.id,
        firstName: "Maria",
        lastName: "Petrova",
        email: "maria@example.com",
        phone: "+359888111111",
        ticketType: "VIP",
        amountDue: 200,
        amountPaid: 50,
        paymentStatus: "PARTIAL",
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
