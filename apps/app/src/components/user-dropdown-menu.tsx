"use client";

import { useAuth } from "@clerk/nextjs";

export function UserDropdownMenu() {
  const { signOut, isSignedIn } = useAuth();

  return <div>User dropdown menu</div>;
}
