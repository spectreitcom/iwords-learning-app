import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { randomUUID } from "node:crypto";

type Props = Readonly<{
  headers: string[];
  rows?: number;
  showPagination?: boolean;
  cellWidths?: (string | number)[];
}>;

export function TableSkeletonLoader({
  headers,
  rows = 10,
  showPagination = false,
  cellWidths = [],
}: Props) {
  const shimmerStyle = {
    background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
  };

  const getSkeletonWidth = (index: number, isLast: boolean) => {
    if (cellWidths[index]) {
      return typeof cellWidths[index] === "string"
        ? cellWidths[index]
        : `${cellWidths[index]}px`;
    }
    if (isLast) return "32px"; // w-8 equivalent
    if (index === 0) return "75%"; // w-3/4 equivalent
    return "64px"; // w-16 equivalent
  };

  return (
    <div className="space-y-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={randomUUID()}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map(() => (
            <TableRow key={randomUUID()} className="border-b">
              {headers.map((_, cellIndex) => {
                const isLast = cellIndex === headers.length - 1;
                const width = getSkeletonWidth(cellIndex, isLast);

                return (
                  <TableCell key={randomUUID()}>
                    <div
                      className={`flex items-center ${isLast ? "" : "space-x-3"}`}
                    >
                      <div
                        className={`h-4 bg-gray-200 animate-pulse rounded ${isLast ? "ml-auto" : ""}`}
                        style={{
                          width,
                          ...shimmerStyle,
                        }}
                      />
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showPagination && (
        <div className="flex justify-end mt-6">
          <div className="flex items-center space-x-2">
            {Array.from({ length: 3 }).map(() => (
              <div
                key={randomUUID()}
                className="w-8 h-8 bg-gray-200 animate-pulse rounded"
                style={shimmerStyle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
