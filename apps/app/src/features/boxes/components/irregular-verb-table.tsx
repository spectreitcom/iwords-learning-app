import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { PronunciationButton } from "@/components/pronunciation-button";

type Props = Readonly<{ forms: string[] }>;

export function IrregularVerbTable({ forms }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>I forma</TableHead>
          <TableHead>II forma</TableHead>
          <TableHead>III forma</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <div className="flex items-center gap-2">
              <PronunciationButton text={forms[0]} />
              {forms[0]}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <PronunciationButton text={forms[1]} />
              {forms[1]}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <PronunciationButton text={forms[2]} />
              {forms[2]}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
