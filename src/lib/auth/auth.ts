import { createServerOnlyFn } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { env } from "~/env/server";
import { db } from "~/lib/db";
import * as schema from "~/lib/db/schema";
import { discordService } from "~/lib/services/discordService";
import { getUserAvatar } from "~/lib/user";

const getAuthConfig = createServerOnlyFn(() =>
  betterAuth({
    baseURL: env.VITE_BASE_URL,
    telemetry: {
      enabled: false,
    },
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),

    // https://www.better-auth.com/docs/integrations/tanstack#usage-tips
    plugins: [reactStartCookies()],

    // https://www.better-auth.com/docs/concepts/session-management#session-caching
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 6 * 60 * 60, // 6 heures
      },
    },

    user: {
      additionalFields: {
        discordId: {
          type: "string",
          required: true,
          unique: true,
          input: false,
        },
        role: {
          type: "string",
          required: true,
          defaultValue: "user",
          input: false,
        },
      },
    },

    // https://www.better-auth.com/docs/concepts/oauth
    socialProviders: {
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        disableDefaultScope: true,
        overrideUserInfoOnSignIn: true,
        prompt: "consent",
        scope: ["identify", "guilds"],
        mapProfileToUser: async (profile) => {
          const discordAvatarUrl = discordService.getDiscordUserAvatarUrl({
            userId: profile.id,
            avatarId: profile.avatar,
            size: 256,
          });
          return {
            email: profile.id + "@fake-discord-email.com",
            name: profile.username,
            image: getUserAvatar(discordAvatarUrl),
            discordId: profile.id,
          };
        },
      },
    },

    // https://www.better-auth.com/docs/authentication/email-password
    emailAndPassword: {
      enabled: false,
    },
  }),
);

export const auth = getAuthConfig();
