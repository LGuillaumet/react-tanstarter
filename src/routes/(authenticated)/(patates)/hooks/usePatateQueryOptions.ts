import { queryOptions } from "@tanstack/react-query";
import { getPatateByIdServerFunction } from "../server/getPatateById.serverFunction";
import { listPatatesServerFunction } from "../server/listPatates.serverFunction";

export const patateQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: ["patates"],
      queryFn: () => listPatatesServerFunction(),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ["patates", id],
      queryFn: () => getPatateByIdServerFunction({ data: { id } }),
    }),
};
