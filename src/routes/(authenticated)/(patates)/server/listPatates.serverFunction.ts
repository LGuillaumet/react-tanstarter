import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth";
import { db } from "~/lib/db";
import { patate } from "~/lib/db/schema";
import type { Patate } from "~/types";

export const listPatatesServerFunction = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await auth.api.getSession({
      headers: getRequest().headers,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const patatesResult = await db
      .select()
      .from(patate)
      .orderBy(patate.createdAt);

    return patatesResult as Patate[];
  },
);
