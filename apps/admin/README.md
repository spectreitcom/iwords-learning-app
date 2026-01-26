# iWords Admin Panel

The admin interface for the iWords language learning platform. Built with **Next.js 15**, this application provides comprehensive tools for managing the learning ecosystem, including content, users, and system configurations.

## 🚀 Key Features

- **Dictionary Management**: Full CRUD operations for expressions, contexts, and sentences. Support for specialized word types (nouns, irregular verbs, etc.).
- **Box System (Leitner)**: Manage learning boxes, tracking items and their progress within the Leitner system.
- **User Administration**: Detailed overview and management of platform users.
- **Admin Management**: Secure system for inviting new administrators and managing credentials.
- **Dashboard**: Centralized view of system statistics and activity.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (via Shadcn UI patterns)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Auth**: Server-side session management using [jose](https://github.com/panva/jose)
- **Monorepo Integration**: Shared UI components and types from `@repo/ui` and `@repo/shared`

## 📂 Project Structure

The project follows a feature-based architecture located in `src/features/`:

- `admin-users/`: Administrative account management and invitation flows.
- `auth/`: Authentication logic, login forms, and session handling.
- `boxes/`: Management of the learning box system.
- `dictionary/`: Core content management (expressions, contexts, and sentences).
- `users/`: Regular user management and overview.

Core directories:

- `src/app/`: Next.js App Router (pages, layouts, and API routes).
- `src/components/`: Shared UI components (Sidebar, TopBar, Pagination, etc.).
- `src/lib/`: Core utilities (auth helpers, environment validation, constants).

## ⚙️ Getting Started

### Prerequisites

This project is part of a monorepo managed with Turborepo. Ensure you have Node.js and your preferred package manager installed.

### Environment Variables

Create a `.env.local` file in the `apps/admin/` directory:

```env
BACKEND_URL=http://your-api-url:4000
SELF_URL=http://localhost:3000
```

### Development

To start the development server with Turbopack:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🔐 Authentication Implementation

- **Session Storage**: JWT tokens are stored in secure, `httpOnly` cookies.
- **Server Requests**: All requests to the backend API use the `authFetch` utility (`src/lib/auth-fetch.ts`), which automatically handles authorization headers and 401 redirects.
- **Protection**: Private routes are protected via Next.js Middleware.

## 🏗 Build and Deployment

To create a production build:

```bash
npm run build
```

The build process utilizes Turborepo for optimized caching and execution.
