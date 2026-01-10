"use client";

import { Input } from "@/components/ui/input";
import { useState, useMemo, useCallback } from "react";
import { redirect } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";

type Props = Readonly<{
  searchText: string;
  otherSearchParams: Record<string, string>;
}>;

export function SearchExpressionsInput({
  searchText,
  otherSearchParams,
}: Props) {
  const [value, setValue] = useState(searchText ?? "");

  const memoizedOtherSearchParams = useMemo(
    () => otherSearchParams,
    [otherSearchParams],
  );

  const redirectFunction = useCallback(
    (searchValue: string) => {
      const urlSearchParams = new URLSearchParams(memoizedOtherSearchParams);
      urlSearchParams.set("searchText", searchValue);
      urlSearchParams.set("page", "1");
      redirect(`?${urlSearchParams.toString()}`);
    },
    [memoizedOtherSearchParams],
  );

  const debouncedRedirect = useDebounceCallback(redirectFunction, 500);

  const handleOnChange = (inputValue: string) => {
    setValue(inputValue);
    debouncedRedirect(inputValue);
  };

  return (
    <Input
      placeholder={"Szukaj wyrażeń"}
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
    />
  );
}
