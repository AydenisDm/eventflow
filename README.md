# EventFlow

Production-ready event registration, attendance, and payment management SaaS platform built with Next.js 15, Prisma, PostgreSQL, and Auth.js.

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style components
- Prisma ORM + PostgreSQL (Neon-ready)
- Auth.js (NextAuth v5) with role-based access
- React Hook Form + Zod validation
- Recharts for dashboard analytics
- Lucide icons

## Roles
- Super Admin
- Administrator
- Registration Staff
- Check-in Staff
- Finance

## Getting Started

1. Clone the repo:
```bash
git clone https://github.com/AydenisDm/eventflow.git
cd eventflow
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment template and fill in your values:
```bash
cp .env.example .env
```
Set `DATABASE_URL` to your PostgreSQL/Neon connection string and generate a random `AUTH_SECRET`.

4. Push the schema and seed the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Run the dev server:
```bash
npm run dev
```

Visit http://localhost:3000

## Seed Accounts (development only)
After seeding, these demo accounts are available (password: `Password123!`):
- admin@eventflow.dev — Super Admin
- organizer@eventflow.dev — Administrator
- registrar@eventflow.dev — Registration Staff
- checkin@eventflow.dev — Check-in Staff
- finance@eventflow.dev — Finance

> Change these credentials before deploying to production.

## Deployment
Deploy on Vercel:
1. Import this repository into Vercel.
2. Add environment variables (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, `NEXTAUTH_URL`).
3. Deploy.

## Project Structure
```
app/               Next.js App Router pages & API routes
lib/               Shared utilities (prisma client, helpers)
prisma/            Database schema & seed script
auth.ts            Auth.js configuration
```

## Roadmap
- [ ] Dashboard UI (stats, charts, activity feed)
- [ ] Events CRUD
- [ ] Participants table with filters/search/bulk actions
- [ ] Registration form workflow
- [ ] Attendance check-in interface with QR support
- [ ] Payments & receipts
- [ ] Reports (PDF/Excel/CSV export)
- [ ] Audit log
- [ ] Settings (branding, roles, notification templates)
