import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export function ClerkProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <OriginalClerkProvider>{children}</OriginalClerkProvider>;
}
