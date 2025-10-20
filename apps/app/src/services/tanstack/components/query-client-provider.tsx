"use client";

import {
  QueryClient,
  QueryClientProvider as OriginalQueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export function QueryClientProvider({ children }: PropsWithChildren) {
  return (
    <OriginalQueryClientProvider client={queryClient}>
      {children}
    </OriginalQueryClientProvider>
  );
}
