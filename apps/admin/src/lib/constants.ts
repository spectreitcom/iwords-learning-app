// Thin re-exports of validated, public (non-secret) env values.
// IMPORTANT: Do not export secrets from this module as it may be used by client bundles.
// Secrets live in `env-server.ts` and must only be imported in server-only modules.

export { BACKEND_URL, SELF_URL } from "./env";
