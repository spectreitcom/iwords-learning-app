import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className={"h-screen flex items-center justify-center bg-gray-100"}>
      <div>{children}</div>
    </div>
  );
}
