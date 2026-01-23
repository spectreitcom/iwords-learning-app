"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchExpressionContexts } from "@/features/dictionary/actions";
import { SearchedExpressionContext } from "@/features/dictionary/types";
import { useEffect, useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useClickOutside } from "@/lib/hooks";

export function DictionarySearch() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounceValue(searchText, 300);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { clickedOutside } = useClickOutside(containerRef.current);

  const { data, isLoading } = useQuery({
    queryKey: ["dictionary-search", debouncedSearchText],
    queryFn: () => searchExpressionContexts(debouncedSearchText),
    enabled: debouncedSearchText.length > 2,
  });

  const results = data?.data ?? [];

  useEffect(() => {
    if (results.length && searchText.length > 2) setOpen(true);
    if (searchText.length <= 2) setOpen(false);
  }, [results, searchText]);

  useEffect(() => {
    if (clickedOutside) {
      setOpen(false);
    }
  }, [clickedOutside]);

  return (
    <div className={"relative min-w-xs"} ref={containerRef}>
      <SearchInput loading={isLoading} onSearch={setSearchText} />

      <SearchResults
        items={results}
        open={open}
        onItemSelected={() => {
          setOpen(false);
          setSearchText("");
        }}
      />
    </div>
  );
}

type SearchResultsProps = Readonly<{
  items: SearchedExpressionContext[];
  open: boolean;
  onItemSelected: () => void;
}>;

function SearchResults({ items, open, onItemSelected }: SearchResultsProps) {
  if (!open) return null;

  return (
    <div
      className={
        "absolute top-full left-0 right-0 mt-2 bg-popover text-popover-foreground rounded-md border shadow-md overflow-hidden z-50"
      }
    >
      <div className="max-h-[300px] overflow-y-auto p-1">
        {items.length > 0 ? (
          items.map((item) => (
            <Link
              key={item.expressionContextId}
              href={`/expression-context/${item.expressionContextId}`}
              onClick={onItemSelected}
              className="flex flex-col items-start gap-0.5 px-3 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
              <span className="text-sm font-medium leading-none">
                {item.phrase}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.translation}
              </span>
            </Link>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            Brak wyników
          </div>
        )}
      </div>
    </div>
  );
}

type SearchInputProps = Readonly<{
  loading: boolean;
  onSearch: (searchText: string) => void;
}>;

function SearchInput({ loading, onSearch }: SearchInputProps) {
  return (
    <div className={"relative"}>
      <Search
        className={
          "absolute top-1/2 transform -translate-y-1/2 left-4 size-4 text-muted-foreground"
        }
      />
      <Input
        placeholder={"Szukaj w słowniku"}
        className={"pl-9"}
        onChange={(e) => onSearch(e.target.value)}
      />
      {loading && (
        <Loader2 className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin" />
      )}
    </div>
  );
}
