"use client";

import { BoxItemPreview } from "@/features/boxes/components/box-item-preview";
import { boxItemSchema } from "@/features/boxes/types";
import { z } from "zod";
import { useId, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel } from "@/components/ui/field";

type Props = Readonly<{
  boxDetailsItems: z.infer<typeof boxItemSchema>[];
}>;

export function BoxItemPreviewList({ boxDetailsItems }: Props) {
  const [hidePhrase, setHidePhrase] = useState(false);
  const [hideTranslation, setHideTranslation] = useState(true);

  const hidePhraseId = useId();
  const hideTranslationId = useId();

  return (
    <div className={"mt-8"}>
      <div className={"inline-flex width-full"}>
        <Field orientation={"horizontal"}>
          <Switch
            id={hidePhraseId}
            checked={hidePhrase}
            onCheckedChange={(checked) => {
              setHidePhrase(checked);
            }}
          />
          <FieldLabel htmlFor={hidePhraseId}>Ukryj frazę</FieldLabel>
        </Field>
        <Field orientation={"horizontal"}>
          <Switch
            id={hideTranslationId}
            checked={hideTranslation}
            onCheckedChange={(checked) => {
              setHideTranslation(checked);
            }}
          />
          <FieldLabel htmlFor={hideTranslationId}>Ukryj tłumaczenie</FieldLabel>
        </Field>
      </div>

      <div className={"flex flex-col gap-4 mt-4"}>
        {boxDetailsItems.map((item) => (
          <BoxItemPreview
            key={item.expressionContextId}
            item={item}
            hidePhrase={hidePhrase}
            hideTranslation={hideTranslation}
          />
        ))}
      </div>
    </div>
  );
}
