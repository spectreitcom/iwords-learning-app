"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { useEffect, useState } from "react";
import { SearchedDictionaryExpression } from "@/features/dictionary/types";
import { Input } from "@repo/ui/components/ui/input";
import { searchDictionaryExpressions } from "@/features/dictionary/actions";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { expressionTypeMap } from "@/features/dictionary/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@repo/ui/components/ui/badge";
import { useDebounceCallback } from "usehooks-ts";
import { addItemToBox } from "@/features/boxes/actions";

type Props = Readonly<{
  boxId: string;
  chosenExpressionContextIds: string[];
}>;

export function AddItemToBoxModal({
  boxId,
  chosenExpressionContextIds = [],
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedItems, setSearchedItems] = useState<
    SearchedDictionaryExpression[]
  >([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedExpressionContextId, setSelectedExpressionContextId] =
    useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const debouncedSearchText = useDebounceCallback(setSearchText, 500);

  useEffect(() => {
    if (!open) {
      setSearchText("");
      setSearchedItems([]);
      setSelectedExpressionContextId(null);
      // Reset także flagę pobierania przy zamykaniu modala dla spójności stanów
      setIsFetching(false);
      return;
    }

    if (open && boxId) {
      setSearchedItems([]);
      setSelectedExpressionContextId(null);
      setIsFetching(true);
      setIsSaving(false);
      searchDictionaryExpressions(searchText, 1, 5)
        .then((data) => {
          setSearchedItems(data.data);
        })
        .finally(() => setIsFetching(false));
    }
  }, [searchText, boxId, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Dodaj element</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowy element to boxa</DialogTitle>
        </DialogHeader>

        <Input
          placeholder={"Szukaj"}
          onChange={(e) => debouncedSearchText(e.target.value)}
        />

        {isFetching ? <ModalLoader /> : ""}

        {!isFetching && searchedItems.length ? (
          <div className={"mt-4"}>
            {searchedItems.map((item) => (
              <Item
                onClick={() =>
                  setSelectedExpressionContextId(item.expressionContextId)
                }
                key={item.expressionContextId}
                item={item}
                selected={
                  selectedExpressionContextId === item.expressionContextId
                }
                chosen={chosenExpressionContextIds.includes(
                  item.expressionContextId,
                )}
              />
            ))}
          </div>
        ) : (
          ""
        )}

        <Button
          disabled={isFetching || !selectedExpressionContextId || isSaving}
          onClick={async () => {
            if (selectedExpressionContextId) {
              setIsSaving(true);
              await addItemToBox(boxId, selectedExpressionContextId);
              setOpen(false);
            }
          }}
        >
          Zapisz
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function Item({
  item,
  selected,
  chosen,
  onClick,
}: Readonly<{
  item: SearchedDictionaryExpression;
  selected?: boolean;
  chosen?: boolean;
  onClick: () => void;
}>) {
  const handleClick = () => {
    if (chosen) return;
    onClick();
  };

  return (
    <Card
      className={cn("mb-4 cursor-pointer", selected && "border-primary")}
      onClick={handleClick}
    >
      <CardContent className={"relative"}>
        {chosen && <Badge className={"absolute -top-3 right-2"}>Wybrany</Badge>}
        <div>
          {item.phrase} - {item.translation}
        </div>
        <div className={"text-xs"}>{expressionTypeMap.get(item.type)}</div>
      </CardContent>
    </Card>
  );
}

function ModalLoader() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
