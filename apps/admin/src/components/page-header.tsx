import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { ReactNode } from "react";

type PageHeaderProps = Readonly<{
  title: string;
  backLink?: {
    href: string;
    label?: string;
  };
  subtitle?: ReactNode;
}>;

export function PageHeader({ title, backLink, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backLink && (
        <Link
          href={backLink.href}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          {backLink.label ?? "Powrót"}
        </Link>
      )}
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && <div className="mt-2 text-muted-foreground">{subtitle}</div>}
    </div>
  );
}
