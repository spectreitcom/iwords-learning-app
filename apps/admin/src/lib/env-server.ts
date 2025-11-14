// Server-only validated environment variables containing secrets.
// This module must NEVER be imported from client components.
// It intentionally imports `server-only` to make Next.js fail fast if misused.

import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  SECRET_KEY: z.string().min(1, "SECRET_KEY is required"),
});

const parsed = serverEnvSchema.safeParse({
  SECRET_KEY: process.env.SECRET_KEY,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("; ");
  throw new Error(`Invalid server environment configuration: ${issues}`);
}

export const { SECRET_KEY } = parsed.data;
