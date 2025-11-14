// Validated public environment variables (safe for both server and client).
// Do NOT add secrets here. Secrets must live in `env-server.ts` only.

import { z } from "zod";

const publicEnvSchema = z.object({
  BACKEND_URL: z.url(),
  SELF_URL: z.url(),
});

const parsed = publicEnvSchema.safeParse({
  BACKEND_URL: process.env.BACKEND_URL,
  SELF_URL: process.env.SELF_URL,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("; ");
  throw new Error(`Invalid public environment configuration: ${issues}`);
}

export const { BACKEND_URL, SELF_URL } = parsed.data;
