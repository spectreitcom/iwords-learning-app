# iWords API

The core of the iWords vocabulary learning system. A backend application built on the NestJS framework, implementing business logic in a Modular Monolith architecture.

## 🚀 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (v11)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/) (users), Passport JWT (administrators)
- **AI:** OpenAI API (generating contexts and translations)
- **Caching/Queues:** Redis (ioredis)
- **Communication:** NestJS CQRS (Command Query Responsibility Segregation)
- **Other:** Joi (env validation), Zod, Swagger (API documentation), Helmet, Throttler.

## 🏗️ Architecture

The project is designed based on **Modular Monolith** and **Domain-Driven Design (DDD)** principles. Each business module (Bounded Context) has its own structure:
- `domain`: Business logic, entities, aggregates.
- `application`: Application services, commands, queries (CQRS).
- `infrastructure`: Repository implementation (Prisma), external integrations.
- `views`: Read Models optimized for queries.

### Communication Patterns:
- **CQRS:** Separation of write and read operations.
- **Outbox/Inbox Pattern:** Ensuring eventual consistency and reliable asynchronous communication between modules.

## 📦 Business Modules

- **Dictionary:** Management of vocabulary, phrases, and their contexts.
- **Box & Box-Repetition:** Repetition system based on the Leitner method (boxes).
- **Repetition:** General repetition scheduling logic.
- **Gamification:** Motivation system (daily goals, statistics, points).
- **User-Identity:** Integration with Clerk, user profile management.
- **Admin-Identity:** Admin panel and permission management.
- **Answer:** Handling user responses.
- **BFF (Backend For Frontend):** Data aggregation layer for user interfaces (Gateway, AdminGateway, Webhooks).

## 🛠️ Installation and Setup

### Requirements:
- Node.js (v20+)
- Docker (for database and Redis)
- OpenAI API Key
- Clerk Account

### Steps:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (`.env` file in `apps/api`):
   Copy `.env.example` (if it exists) or create your own based on the "Environment Variables" section.

3. Start infrastructure (Docker):
   ```bash
   docker-compose up -d
   ```

4. Generate Prisma client and run migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. Start the application:
   ```bash
   npm run dev
   ```

## ⚙️ Environment Variables

Key variables required for operation (defined in `env-schema.ts`):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection URL |
| `REDIS_URI` | Redis connection URL |
| `JWT_SECRET` | Private key for signing JWT tokens |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLERK_WEBHOOK_SECRET`| Secret for verifying Clerk webhooks |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_BASE_URL` | Base URL for OpenAI (optional proxy) |
| `OPENAI_MODEL` | OpenAI model name (e.g., `gpt-4o`) |

## 🧪 Testing

- **Unit:** `npm run test`
- **E2E:** `npm run test:e2e`
- **Coverage:** `npm run test:cov`

## 💻 CLI

The project includes a command-line interface for administrative tasks:
- `npm run create:superuser` - Create a system administrator.

---
iWords API Project - 2026.
