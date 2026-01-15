"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createSentence,
  generateSentencesForExpressionContext,
} from "@/features/dictionary/actions";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { randomUUID } from "node:crypto";

type GeneratedSentence = {
  sentence: string;
  translation: string;
};

type Props = Readonly<{
  expressionId: string;
  expressionContextId: string;
}>;

export function GenerateSentences({
  expressionId,
  expressionContextId,
}: Props) {
  const [generatedSentences, setGeneratedSentences] = useState<
    GeneratedSentence[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [addingStates, setAddingStates] = useState<Record<number, boolean>>({});

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const sentences =
        await generateSentencesForExpressionContext(expressionContextId);
      setGeneratedSentences(sentences);
    } catch (error) {
      console.error("Failed to generate sentences:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSentence = async (
    index: number,
    sentence: GeneratedSentence,
  ) => {
    setAddingStates((prev) => ({ ...prev, [index]: true }));
    try {
      await createSentence(expressionId, expressionContextId, {
        content: sentence.sentence,
        translation: sentence.translation,
      });
      // Remove the added sentence from the list
      setGeneratedSentences((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Failed to add sentence:", error);
    } finally {
      setAddingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleGenerate} loading={isGenerating}>
          Generuj zdania
        </Button>
      </div>

      {generatedSentences.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Wygenerowane zdania</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zdanie</TableHead>
                <TableHead>Tłumaczenie</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedSentences.map((sentence, index) => (
                <TableRow key={randomUUID()}>
                  <TableCell>{sentence.sentence}</TableCell>
                  <TableCell>{sentence.translation}</TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleAddSentence(index, sentence)}
                      loading={addingStates[index]}
                    >
                      Dodaj
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
