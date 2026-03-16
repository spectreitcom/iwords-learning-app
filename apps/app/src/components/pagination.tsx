import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = Readonly<{
  currentPage: number;
  total: number;
  take: number;
  otherSearchParams?: Record<string, string>;
}>;

export function Pagination({
  currentPage,
  take,
  total,
  otherSearchParams,
}: Props) {
  const pages = Math.ceil(total / take);

  if (pages <= 1) {
    return null;
  }

  const urlSearchParams = new URLSearchParams(otherSearchParams);
  urlSearchParams.delete("page");

  const buildHref = (page: number) => {
    const params = new URLSearchParams(urlSearchParams);
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <Button
        variant="outline"
        size="icon-sm"
        asChild
        className={cn(
          currentPage === 1 &&
            "pointer-events-none opacity-50 cursor-not-allowed",
        )}
      >
        <Link href={buildHref(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div className="text-sm font-medium">
        Strona {currentPage} z {pages}
      </div>
      <Button
        variant="outline"
        size="icon-sm"
        asChild
        className={cn(
          currentPage >= pages &&
            "pointer-events-none opacity-50 cursor-not-allowed",
        )}
      >
        <Link href={buildHref(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
