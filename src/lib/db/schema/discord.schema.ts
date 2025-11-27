import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const discordServer = pgTable("discord_server", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

