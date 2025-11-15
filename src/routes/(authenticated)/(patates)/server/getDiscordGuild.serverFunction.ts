import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "~/lib/auth/auth";
import { discordService } from "~/lib/services/discordService";

const getDiscordGuildInputSchema = z.object({
  guildId: z.string().min(1, "L'identifiant du serveur Discord est requis"),
});

export const getDiscordGuildServerFunction = createServerFn({ method: "GET" })
  .inputValidator(getDiscordGuildInputSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    return discordService.fetchDiscordGuild(data.guildId);
  });
