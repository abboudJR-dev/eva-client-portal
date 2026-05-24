# EVA Interiors — Client Portal

A client-facing portal where EVA's sales team manages interior design project progress and clients track their design journey in real-time.

## Features

- **Client Dashboard** — Real-time progress tracking with phase timeline
- **Approvals** — Clients approve directly from the portal (or EVA marks on their behalf)
- **Documents** — All project documents accessible in one place with links
- **Schedule** — Visual project timeline with milestones
- **Admin Panel** — Full project management: create clients, update progress, manage documents & approvals
- **EVA Branding** — Matches EVA's luxury gold/charcoal aesthetic

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- NextAuth.js (Credentials)
- Prisma + Vercel Postgres
- Deployed on Vercel

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import in Vercel
3. Add a Vercel Postgres database (Storage > Create > Postgres)
4. Set environment variables:
   - `DATABASE_URL` — from Vercel Postgres
   - `DIRECT_URL` — from Vercel Postgres
   - `AUTH_SECRET` — run `openssl rand -base64 32`
   - `AUTH_URL` — your deployed URL (e.g., `https://eva-portal.vercel.app`)
5. Deploy
6. Run database setup: `npx prisma db push`
7. Seed admin user: `npm run db:seed`

## Default Login

- **Admin**: `admin@evainteriors.ae` / `admin123`
- **Clients**: Created by admin with custom credentials

## Local Development

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Requires a PostgreSQL database. Set `DATABASE_URL` and `DIRECT_URL` in `.env`.

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/        — Login page
│   ├── (client)/            — Client-facing pages (dashboard, approvals, docs, schedule)
│   ├── (admin)/admin/       — Admin panel (dashboard, clients, projects)
│   └── api/                 — API routes (auth, projects, approvals, documents)
├── components/
│   ├── admin/               — Admin components (forms, editors)
│   ├── client/              — Client components (timeline, approvals list)
│   └── layout/              — Nav components
└── lib/                     — Auth, DB, types, phase templates
```
