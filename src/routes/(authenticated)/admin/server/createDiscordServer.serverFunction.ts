import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "~/lib/auth/auth";
import { db } from "~/lib/db";
import { discordServer, user } from "~/lib/db/schema";

export const createDiscordServerInputSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  name: z.string().optional(),
  icon: z.string().optional(),
});

export const createDiscordServerServerFunction = createServerFn({ method: "POST" })
  .inputValidator(createDiscordServerInputSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const dbUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (dbUser?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Fetch guild details from the bot
    const response = await fetch(`http://localhost:3001/guilds/${data.id}`);
    if (!response.ok) {
      throw new Error("Impossible de récupérer les informations du serveur via le bot");
    }
    const guildData = (await response.json()) as { name: string; icon: string | null };

    const [server] = await db
      .insert(discordServer)
      .values({
        id: data.id,
        name: guildData.name,
        icon: guildData.icon || undefined,
      })
      .returning();

    return server;
  });
