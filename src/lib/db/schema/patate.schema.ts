import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

// Une patate est une partie ou chaque user doit envoyer chacun son tour un ou plusieurs fichiers pour que les autres puissent les voir et les noter
// Une patate a un nom, une description, une date de début, une date de fin, un nombre de fichiers à envoyer par tour, un nombre de tours
// Une patate a un créateur
// Une patate a des participants
// Une patate a des fichiers

export const patate = pgTable("patate", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  rules: text("rules"),
  theme: text("theme"),
  currentUserId: text("current_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  processStep: text("process_step", { enum: ["DRAFT", "STARTED", "ADMIN_REVIEW", "COMPLETED"] })
    .default("DRAFT")
    .notNull(),
  discordServerId: text("discord_server_id").notNull(),
  discordChannelId: text("discord_channel_id"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  updatedBy: text("updated_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at"),
});

export const patateParticipant = pgTable(
  "patate_participant",
  {
    id: serial("id").primaryKey().notNull(),
    patateId: integer("patate_id")
      .notNull()
      .references(() => patate.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    order: integer("order"),
    role: text({ enum: ["admin", "admin_player", "player"] }).notNull(),
    validatedSubmissionAt: timestamp("validated_submission_at"),
    invalidatedSubmissionAt: timestamp("invalidated_submission_at"),
    confirmParticipation: boolean("confirm_participation").default(false).notNull(),
    numberOfRefusedParticipations: integer("number_of_refused_participations")
      .default(0)
      .notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    check(
      "number_of_refused_participations",
      sql`${table.numberOfRefusedParticipations} <= 2`,
    ),
  ],
);

export const patateFile = pgTable("patate_file", {
  id: serial("id").primaryKey().notNull(),
  patateId: integer("patate_id")
    .notNull()
    .references(() => patate.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at"),
});

export const patateFileLike = pgTable(
  "patate_file_like",
  {
    id: serial("id").primaryKey().notNull(),
    patateFileId: integer("patate_file_id")
      .notNull()
      .references(() => patateFile.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    // Un utilisateur ne peut pas aimer deux fois le même fichier
    // On utilise une contrainte d'unicité sur (userId, patateFileId)
    sql`UNIQUE (${table.userId}, ${table.patateFileId})`,
  ],
);

export const patateFileComment = pgTable("patate_file_comment", {
  id: serial("id").primaryKey().notNull(),
  patateFileId: integer("patate_file_id")
    .notNull()
    .references(() => patateFile.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at"),
});

export const patateProblem = pgTable("patate_problem", {
  id: serial("id").primaryKey().notNull(),
  patateId: integer("patate_id")
    .notNull()
    .references(() => patate.id, { onDelete: "cascade" }),
  fromUserId: text("from_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  toUserId: text("to_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // ID du participant pour lequel le thread de problèmes est destiné
  // Permet de grouper les conversations par participant même si l'admin participe
  threadUserId: text("thread_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isResolved: boolean("is_resolved").default(false).notNull(),
  adminDiscordId: text("admin_discord_id").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at"),
});
