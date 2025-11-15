import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "~/lib/auth/auth";
import { db } from "~/lib/db";
import { patate, user } from "~/lib/db/schema";
import type { PatateWithCreator } from "~/types";

const getPatateByIdInputSchema = z.object({
  id: z.coerce.number(),
});

export const getPatateByIdServerFunction = createServerFn({ method: "GET" })
  .inputValidator(getPatateByIdInputSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const [patateResult] = await db
      .select()
      .from(patate)
      .where(eq(patate.id, data.id))
      .limit(1);

    if (!patateResult) {
      throw new Error("Patate not found");
    }

    const [creator] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        discordId: user.discordId,
      })
      .from(user)
      .where(eq(user.id, patateResult.createdBy))
      .limit(1);

    if (!creator) {
      throw new Error("Patate creator not found");
    }

    const patateWithCreator: PatateWithCreator = {
      ...patateResult,
      creator,
    };

    return patateWithCreator;
  });
