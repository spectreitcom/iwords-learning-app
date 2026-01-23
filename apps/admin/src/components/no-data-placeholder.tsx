import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Search } from "lucide-react";

type Props = Readonly<{
  heading: string;
  description: string;
  description2?: string;
}>;

export function NoDataPlaceholder({
  heading,
  description,
  description2,
}: Props) {
  return (
    <Card className="w-full mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{heading}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        {description2 && (
          <div className="text-xs text-gray-400">{description2}</div>
        )}
      </CardContent>
    </Card>
  );
}
