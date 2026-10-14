# HealSync

Full-stack hospital doctor-patient appointment management built with Next.js, TypeScript, Tailwind CSS, Prisma, SQLite, Zod, bcrypt, Lucide, date-fns, Recharts, and Vitest.

## Features

- Patient, doctor, and admin authentication with signed HTTP-only sessions.
- Role-protected route groups and server-side authorization checks.
- Department management and doctor search/filtering.
- Doctor profile, weekly availability, leave dates, and generated slots.
- Appointment lifecycle: `REQUESTED`, `ACCEPTED`, `COMPLETED`, `REJECTED`, `CANCELLED`.
- Database-level conflict keys to prevent doctor and patient double booking.
- Doctor accept/reject/cancel/complete flows with consultation notes.
- Patient dashboards, appointment history, notifications, and profile management.
- Admin dashboards, doctor approval/disable flow, users, departments, appointments, audit logs, and charts.
- Seed data and focused business-rule tests.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set the local file database URL in `.env`:

```bash
DATABASE_URL="file:./healsync.db"
```

Add an `AUTH_SECRET` value to `.env` for signed sessions.

3. Create the database, generate Prisma Client, and load demo data:

```bash
npm run db:setup
```

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

The SQLite database is stored in `healsync.db` and is excluded from Git. SQLite works for local development and single-instance hosting. Netlify's serverless functions do not provide persistent shared local disk storage, so use a hosted database such as Supabase Postgres for a reliable Netlify deployment.

## Development Credentials

All seeded accounts use:

```text
Password@123
```

Seeded users:

```text
Admin:   admin@healsync.local
Doctor:  doctor1@healsync.local
Patient: patient1@healsync.local
```

## Useful Commands

```bash
npm run lint
npm run typecheck
npm test
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

Development reset, destructive:

```bash
npm run db:reset
```

## Security Notes

This is a functional production-oriented foundation, but a real hospital deployment must add operational hardening: audited email reset tokens, rate limiting backed by shared storage, formal consent/privacy workflows, encryption and retention policies, deployment-specific secure headers, logging controls, and compliance review for the applicable healthcare and privacy regime.

`npm audit` currently reports a high-severity advisory in Prisma's `@prisma/config` dependency path. The automated fix downgrades Prisma to v6 and is breaking for this Prisma 7 project, so it was not applied.
