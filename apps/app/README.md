# iWords Learning App - Client Application

This is the main client-side application for the iWords language learning platform. It provides a modern, interactive interface for users to manage their vocabulary, perform daily repetitions, and track their learning progress.

## 🚀 Features

- **Box System (Leitner Method)**: Organize your vocabulary into different boxes to optimize the learning process using spaced repetition.
- **Learning Modes**:
  - **Simple Translation**: Basic word-to-word translation exercises.
  - **Sentence Training**: Learn expressions in context with sentence-based exercises.
  - **Irregular Verbs**: Dedicated training for irregular verb forms.
- **Repetitions**: A specialized system for managing and completing daily review tasks to ensure long-term retention.
- **Gamification**: Stay motivated with progress tracking, goal widgets, and daily achievement monitoring.
- **Dictionary**: Browse and manage your personal collection of expressions and vocabulary.
- **Modern UI/UX**: Built with accessibility and responsiveness in mind using Radix UI and Tailwind CSS.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Monorepo Management**: [Turborepo](https://turbo.build/)

## 📂 Project Structure

```text
src/
├── app/            # Next.js App Router pages and layouts
├── components/     # Shared UI components (sidebar, topbar, providers)
├── features/       # Domain-driven feature modules
│   ├── auth/               # Authentication logic and components
│   ├── boxes/              # Box management system
│   ├── box-repetition/     # Specific logic for box-based repetitions
│   ├── dictionary/         # Expression management
│   ├── gamification/       # Progress tracking and widgets
│   ├── learning/           # Core learning engine and exercise types
│   ├── repetitions/        # Daily review logic
│   └── sentence-training/  # Sentence-focused exercises
├── hooks/          # Shared React hooks
├── lib/            # Utility functions and shared constants
└── services/       # External service integrations (Clerk, TanStack Query)
```

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (Latest LTS recommended)
- `npm` or `pnpm`

### Installation

1. Install dependencies from the project root:

   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env-example` to `.env` and fill in the required values:
   ```bash
   cp .env-example .env
   ```

### Running Development Server

Start the application on [http://localhost:3001](http://localhost:3001):

```bash
npm run dev
```

## 🔐 Environment Variables

The application requires the following environment variables:

- `BACKEND_URL`: The URL of the iWords API.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key for client-side authentication.
- `CLERK_SECRET_KEY`: Clerk secret key for server-side authentication.

## 📦 Related Packages

This application depends on shared packages within the monorepo:

- `@repo/shared`: Shared types and business logic.
- `@repo/ui`: Common UI components library.
