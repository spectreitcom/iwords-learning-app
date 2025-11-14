import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input w-full min-w-0 text-base outline-none md:text-sm",
        // Size & spacing
        "h-10 rounded-lg border px-3 py-2 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Backgrounds (light/dark)
        "bg-background/60 dark:bg-input/30",
        // Interaction & feedback
        "transition-[background-color,box-shadow,border-color] shadow-xs focus:shadow-sm",
        // Focus and invalid states
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
