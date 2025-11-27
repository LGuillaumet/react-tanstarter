import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { auth } from "~/lib/auth/auth";
import { db } from "~/lib/db";
import { discordServer, user } from "~/lib/db/schema";

export const listDiscordServersServerFunction = createServerFn({ method: "GET" }).handler(
  async () => {
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

    return await db.select().from(discordServer);
  },
);
