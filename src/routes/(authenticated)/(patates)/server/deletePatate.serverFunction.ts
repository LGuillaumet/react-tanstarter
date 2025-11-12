import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "~/lib/auth/auth";
import { db } from "~/lib/db";
import { patate } from "~/lib/db/schema";

const deletePatateSchema = z.object({
  id: z.coerce.number(),
});

export const deletePatateServerFunction = createServerFn({ method: "POST" })
  .inputValidator(deletePatateSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const [patateToDelete] = await db
      .select({ id: patate.id, createdBy: patate.createdBy })
      .from(patate)
      .where(eq(patate.id, data.id))
      .limit(1);

    if (!patateToDelete) {
      throw new Error("Patate not found");
    }

    if (patateToDelete.createdBy !== session.user.id) {
      throw new Error("Forbidden");
    }

    await db.delete(patate).where(eq(patate.id, data.id));

    return { success: true };
  });
