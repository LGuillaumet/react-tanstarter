import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "~/lib/auth/auth";
import { db } from "~/lib/db";
import { patate } from "~/lib/db/schema";
import type { Patate } from "~/types";

export const createPatateInputSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  rules: z.string().optional(),
  theme: z.string().optional(),
  discordServerId: z.string().min(1, "L'ID du serveur Discord est requis"),
  discordChannelId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type CreatePatateInput = z.infer<typeof createPatateInputSchema>;

export const createPatateServerFunction = createServerFn({ method: "POST" })
  .inputValidator(createPatateInputSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const now = new Date();
    const [newPatate] = await db
      .insert(patate)
      .values({
        name: data.name,
        rules: data.rules ?? null,
        theme: data.theme ?? null,
        discordServerId: data.discordServerId,
        discordChannelId: data.discordChannelId ?? null,
        startDate: data.startDate ?? null,
        endDate: data.endDate ?? null,
        createdBy: session.user.id,
        updatedBy: session.user.id,
        createdAt: now,
      })
      .returning();

    return newPatate as Patate;
  });

