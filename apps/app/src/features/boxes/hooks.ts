import { useInfiniteQuery } from "@tanstack/react-query";
import { getBoxesList } from "@/features/boxes/actions";

export function useBoxesListQuery() {
  return useInfiniteQuery({
    queryKey: ["boxes"],
    queryFn: ({ pageParam = 1 }) => getBoxesList(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, total } = lastPage;
      const take = 20; // Default take from getBoxesList
      const hasMore = currentPage * take < total;
      return hasMore ? currentPage + 1 : undefined;
    },
    refetchInterval: 1000 * 20,
  });
}
