import { useQuery } from "@tanstack/react-query";
import { getBoxesList } from "@/features/boxes/actions";

export function useBoxesListQuery(page = 1) {
  return useQuery({
    queryKey: ["boxes", page],
    queryFn: () => getBoxesList(page),
  });
}
