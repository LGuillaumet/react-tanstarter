import { queryOptions } from "@tanstack/react-query";
import { Patate, PatateWithCreator } from "~/types";
import { getPatateByIdServerFunction } from "../server/getPatateById.serverFunction";
import { listPatatesServerFunction } from "../server/listPatates.serverFunction";

export const patateQueryOptions = {
  list: () =>
    queryOptions<Patate[]>({
      queryKey: ["patates"],
      queryFn: () => listPatatesServerFunction(),
    }),

  getPatateById: (id: Patate["id"]) =>
    queryOptions<PatateWithCreator>({
      queryKey: ["patates", id],
      queryFn: () => getPatateByIdServerFunction({ data: { id } }),
    }),
};
