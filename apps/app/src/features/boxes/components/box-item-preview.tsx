import { BoxItem } from "@/features/boxes/types";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { PronunciationButton } from "@/components/pronunciation-button";
import { HideText } from "@/components/hide-text";
import { BoxItemDropdownMenu } from "@/features/boxes/components/box-item-dropdown-menu";
import { expressionTypeMap } from "@repo/shared/utils";
import { capitalizeFirstLetter } from "@/lib/utils";
import { IrregularVerbTable } from "@/features/boxes/components/irregular-verb-table";

type Props = Readonly<{
  item: BoxItem;
  hidePhrase?: boolean;
  hideTranslation?: boolean;
}>;

export function BoxItemPreview({ item, hideTranslation, hidePhrase }: Props) {
  return (
    <Card className={"group"}>
      <CardContent>
        <div className={"flex items-start justify-between gap-2"}>
          <div className={"flex items-center gap-2"}>
            <PronunciationButton text={item.phrase} />
            <h3 className={"text-lg"}>
              <strong>
                <HideText text={item.phrase} isHidden={hidePhrase ?? false} />
              </strong>{" "}
              -{" "}
              <HideText
                text={item.translation}
                isHidden={hideTranslation ?? false}
              />
            </h3>
          </div>
          <BoxItemDropdownMenu expressionContextId={item.expressionContextId} />
        </div>

        <div className={"mt-2"}>
          <p>Typ wyrażenia: {expressionTypeMap.get(item.type)}</p>
          {item.type === "noun" && (
            <p>Policzalny: {item.isCountable ? "Tak" : "Nie"}</p>
          )}
        </div>

        {item.definition ? (
          <div className={"mt-4"}>
            <p>
              <strong>Definicja:</strong>{" "}
              <HideText text={item.definition} isHidden={hidePhrase ?? false} />
            </p>
            {item.definitionTranslation && (
              <p className={"mt-4"}>
                <strong>Tłumaczenie definicji:</strong>{" "}
                <HideText
                  text={item.definitionTranslation}
                  isHidden={hideTranslation ?? false}
                />
              </p>
            )}
          </div>
        ) : (
          ""
        )}

        {item.type === "irregular_verb" && (
          <div className={"mt-4"}>
            <IrregularVerbTable forms={item.forms ?? []} />
          </div>
        )}

        {item.sentences.length ? (
          <div className={"mt-4 flex flex-col gap-1"}>
            {item.sentences.map((sentence) => (
              <div key={sentence.sentenceId}>
                <span className={"font-semibold"}>
                  <PronunciationButton text={sentence.content} />
                  <HideText
                    text={capitalizeFirstLetter(sentence.content)}
                    isHidden={hidePhrase ?? false}
                  />
                </span>{" "}
                -{" "}
                <HideText
                  text={capitalizeFirstLetter(sentence.translation)}
                  isHidden={hideTranslation ?? false}
                />
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </CardContent>
    </Card>
  );
}
