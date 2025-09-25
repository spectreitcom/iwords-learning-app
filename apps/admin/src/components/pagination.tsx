import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  total: number;
  take: number;
  otherSearchParams?: Record<string, string>;
};

export function Pagination({
  currentPage,
  take,
  total,
  otherSearchParams,
}: Props) {
  const pages = Math.ceil(total / take);

  const urlSearchParams = new URLSearchParams(otherSearchParams);
  urlSearchParams.delete("page");

  return (
    <div className={"flex justify-between items-center gap-2 w-46"}>
      <Button
        variant={"ghost"}
        asChild
        className={cn(
          currentPage === 1 &&
            "pointer-events-none opacity-50 cursor-not-allowed",
        )}
      >
        <Link href={`?page=${currentPage - 1}&${urlSearchParams.toString()}`}>
          <ChevronLeft />
        </Link>
      </Button>
      <div>
        {currentPage} z {pages}
      </div>
      <Button
        variant={"ghost"}
        disabled={currentPage === pages}
        asChild
        className={cn(
          currentPage === pages &&
            "pointer-events-none opacity-50 cursor-not-allowed",
        )}
      >
        <Link href={`?page=${currentPage + 1}&${urlSearchParams.toString()}`}>
          <ChevronRight />
        </Link>
      </Button>
    </div>
  );
}
