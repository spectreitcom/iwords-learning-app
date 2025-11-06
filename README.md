# IWords Learning App — Monorepo

This repository contains the IWords learning platform built as a Turborepo monorepo with:

- apps/admin — Admin dashboard (Next.js)
- apps/app — Learner-facing app (Next.js)
- apps/api — Backend API (NestJS + Prisma)

Supporting services are provisioned with Docker (PostgreSQL, Redis, Mailhog). Commit workflow is standardized with Husky, Commitlint, and Commitizen.

## Tech Stack

- Monorepo & DX
  - Turborepo (task pipeline and caching)
  - TypeScript, ESLint, Prettier
  - Husky + Commitlint + Commitizen
- Frontends
  - Next.js 15
  - React 19
  - Tailwind CSS 4
  - Radix UI, lucide-react, tanstack/react-query
- Backend
  - NestJS 11 (CORS + Helmet)
  - Prisma ORM (PostgreSQL)
  - Redis (caching/queues)
  - Swagger (OpenAPI docs under /api/docs)
  - Clerk (auth/webhooks integration)

## Repository Structure

```
.
├─ apps/
│  ├─ admin/        # Next.js Admin (port 3000)
│  ├─ app/          # Next.js App (port 3001)
│  └─ api/          # NestJS API (port 3003 by default)
├─ docker-compose.yml   # Postgres, Redis, Mailhog
├─ turbo.json           # Turborepo task pipeline
├─ package.json         # Workspace scripts
└─ README.md
```

## Prerequisites

- Node.js >= 18
- npm (repo configured with npm@11.x in package.json)
- Docker Desktop (or Docker Engine + Compose plugin)

## Getting Started

1. Clone and install dependencies

```
npm install
```

2. Start infrastructure (Postgres, Redis, Mailhog)

```
docker compose up -d
```

- Postgres: localhost:5432 (db: iwords_db, user: postgres, pass: postgres)
- Redis: localhost:6379
- Mailhog UI: http://localhost:8025 (SMTP on 1025)

3. Create environment files

Create per-app `.env` files as needed.

apps/api/.env (example)

```
# Database (Prisma)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/iwords_db?schema=public"

# JWT
JWT_SECRET="change-me"

# Redis
REDIS_URI="redis://localhost:6379"

# Frontend URLs (used by backends to craft links)
ADMIN_FRONTEND_URL="http://localhost:3000"

# Clerk (Auth)
# Note: code references CLERK_PUBLIC_KEY in main.ts and schema expects CLERK_PUBLISHABLE_KEY.
# Provide both to be safe for local dev.
CLERK_SECRET_KEY="sk_test_xxx"
CLERK_WEBHOOK_SECRET="whsec_xxx"
CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_PUBLIC_KEY="pk_test_xxx"

# Optional
# PORT=3003  # default fallback if not set
```

apps/admin/.env.local (example)

```
# Backend base URL used by admin frontend
BACKEND_URL="http://localhost:3003"

# Self URL (useful for links)
SELF_URL="http://localhost:3000"

# Secret for admin-only flows if required by the app
# (Referenced in src/lib/constants.ts)
SECRET_KEY="change-me"
```

apps/app/.env.local (example)

```
# Backend base URL used by learner app
BACKEND_URL="http://localhost:3003"

# Optionally define these if later required by code
# SELF_URL="http://localhost:3001"
# SECRET_KEY="change-me"
```

4. Prepare the database (Prisma)

```
# From repo root or apps/api
cd apps/api
npm run prisma:generate
npm run prisma:migrate   # generates/updates your local schema
# Optional: seed (if a seeding script is configured)
npm run prisma:seed
```

5. Run all apps in dev mode (Turborepo)

From repository root:

```
npm run dev
```

This runs `turbo run dev` and launches:

- Admin: http://localhost:3000
- App: http://localhost:3001
- API: http://localhost:3003 (Swagger: http://localhost:3003/api/docs)

You can also run each app individually:

- Admin

  ```
  cd apps/admin
  npm run dev  # port 3000
  ```

- App

  ```
  cd apps/app
  npm run dev  # port 3001
  ```

- API
  ```
  cd apps/api
  npm run dev:watch  # or npm run dev
  ```

## Useful Scripts

Root scripts (package.json):

- `npm run dev` — `turbo run dev` (starts all workspace apps with dev scripts)
- `npm run build` — `turbo run build`
- `npm run lint` — `turbo run lint`
- `npm run check-types` — `turbo run check-types`
- `npm run format` — Prettier write for ts/tsx/md

API scripts (apps/api/package.json):

- `dev`, `dev:watch`, `start`, `start:prod`
- `build`
- `lint`
- `test`, `test:watch`, `test:cov`, `test:e2e`
- Prisma: `prisma:generate`, `prisma:migrate`, `prisma:migrate:deploy`, `prisma:migrate:reset`, `prisma:studio`, `prisma:seed`
- `create:superuser` — runs CLI command from compiled dist:
  ```
  # Build first to generate dist/
  npm run build
  node dist/src/cli/cli.js create-admin-user
  ```

Admin/App scripts (apps/admin & apps/app):

- `dev`, `build`, `start`, `lint`

## API Details

- Global prefix: `/api`
- Swagger: `/api/docs` (on the API base URL)
- Default dev port: `3003` (configurable via `PORT`)
- Security middleware: Helmet, CORS enabled
- Auth: Clerk (see env vars in `apps/api/env-schema.ts` and `apps/api/src/main.ts`)

## Commit Workflow

- Conventional commits are enforced.
- Use Commitizen for commits:
  ```
  npm run commit
  ```
- Husky hooks + Commitlint validate commit messages.

## Docker Services and URLs

- Postgres: `postgresql://postgres:postgres@localhost:5432/iwords_db`
- Redis: `redis://localhost:6379`
- Mailhog UI: http://localhost:8025 (SMTP: 1025)

Stop services:

```
docker compose down
```

## License

This project is currently UNLICENSED.

## API — Deep Dive

This section expands on the backend service located at `apps/api` (NestJS 11 + Prisma).

### Architecture Overview

- Framework: NestJS with global prefix `/api`.
- Middlewares: Helmet (security headers), CORS enabled.
- Validation: `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and automatic transformation.
- Documentation: Swagger at `/api/docs` with two bearer schemes (`admin-auth`, `app-auth`).
- Authn/Authz: Clerk middleware initialized early in the pipeline; JWTs for protected endpoints.
- Data: PostgreSQL via Prisma ORM.
- Caching/Queues: Redis (available; used where applicable by modules/background tasks).
- CQRS/Events: `@nestjs/cqrs` used across modules. You will see application event handlers in several domains (see below).

### Environment Variables (apps/api/.env)

Defined/validated in `apps/api/env-schema.ts` using Joi:

- `DATABASE_URL` (required) — PostgreSQL connection string, e.g. `postgresql://postgres:postgres@localhost:5432/iwords_db?schema=public`.
- `JWT_SECRET` (required) — secret used for signing/validating JWT.
- `REDIS_URI` (required) — Redis connection URI, e.g. `redis://localhost:6379`.
- `ADMIN_FRONTEND_URL` (required) — base URL of the Admin app (used for links in emails, redirects, etc.).
- `CLERK_WEBHOOK_SECRET` (required) — secret for verifying Clerk webhooks.
- `CLERK_SECRET_KEY` (required) — Clerk backend secret.
- `CLERK_PUBLISHABLE_KEY` (required) — Clerk publishable key.

Notes:

- In `src/main.ts`, the Clerk middleware reads `CLERK_PUBLIC_KEY`. For local dev, set both `CLERK_PUBLISHABLE_KEY` and `CLERK_PUBLIC_KEY` to your publishable key value to avoid confusion.
- The service listens on `PORT` if set; otherwise defaults to `3003`.

### Running and Developing (apps/api)

Common scripts (see `apps/api/package.json`):

- `npm run dev` — start Nest in dev mode.
- `npm run dev:watch` — dev mode with watch (recommended during active development).
- `npm run build` — compile to `dist/`.
- `npm start` — start (non-watch).
- `npm run start:prod` — run compiled app from `dist/main`.
- Lint/Tests: `npm run lint`, `npm test`, `npm run test:watch`, `npm run test:cov`, `npm run test:e2e`.

Prisma workflow:

- `npm run prisma:generate` — generate Prisma client (run after schema changes).
- `npm run prisma:migrate` — create/apply dev migration.
- `npm run prisma:migrate:deploy` — apply migrations in non-dev environments.
- `npm run prisma:migrate:reset` — reset DB (destructive; use in local dev only).
- `npm run prisma:studio` — open Prisma Studio.
- `npm run prisma:seed` — seed database (if a seeding script is present).

Admin bootstrap (CLI):

- After `npm run build`, you can create a superuser via:
  ```
  node dist/src/cli/cli.js create-admin-user
  ```

### Modules and Domain Events

The codebase follows a modular, event-driven approach (CQRS). Representative modules and their responsibilities include:

- Dictionary
  - Event handlers such as:
    - `sentence-created.event-handler.ts`
    - `sentence-updated.event-handler.ts`
    - `sentence-deleted.event-handler.ts`
    - `expression-phrase-updated.event-handler.ts`
- Repetition (spaced-repetition/learning flow)
  - `repetition/application/event-handlers/answer-checked.event-handler.ts` reacts to answer verification.
- Gamification (points, badges, streaks)
  - `gamification/application/event-handlers/answer-checked.event-handler.ts` updates gamified state after answers are checked.
- Email Notification
  - Event handlers for user lifecycle and admin operations:
    - `user-identity-user-created.event-handler.ts`
    - `admin-requested-reset-password.event-handler.ts`
    - `admin-admin-user-invited.event-handler.ts`

These handlers listen to domain/application events and perform side effects (e.g., updating aggregates, sending emails, publishing further events).

### Email Delivery (Mailhog in dev)

- The API integrates `@nestjs-modules/mailer` for email.
- In local development, start Mailhog (`docker compose up -d`) and browse `http://localhost:8025` to inspect outgoing emails.
- SMTP is available on `localhost:1025`.

### Security Model

- HTTP security headers via Helmet; CORS is enabled by default for local dev.
- Validation is strict: unknown fields are stripped (`whitelist`) and explicitly forbidden (`forbidNonWhitelisted`). DTOs are transformed to expected types.
- Authentication strategies:
  - Clerk middleware validates requests; modules can additionally use Nest guards.
  - JWT bearer tokens are documented in Swagger as two schemes:
    - `admin-auth` — Admin-facing endpoints.
    - `app-auth` — Learner app endpoints.

### Exploring the API

- Open Swagger UI at `http://localhost:3003/api/docs`.
- Use the Authorize button to paste a JWT under either `admin-auth` or `app-auth` depending on the endpoint.

Example curl (adjust endpoint and token accordingly):

```
curl -H "Authorization: Bearer <JWT>" \
     -H "Content-Type: application/json" \
     http://localhost:3003/api/<your-endpoint>
```

### Production Notes

- Ensure all required env vars are provided; do not run with default/secrets from examples.
- Use `prisma migrate deploy` during deployments; run `prisma generate` as part of build.
- Configure `CORS` origins and Helmet policies appropriately per environment.
- Provide durable Redis and Postgres services; set connection URIs accordingly.
- Keep Swagger enabled for internal environments only, or protect it behind auth.
