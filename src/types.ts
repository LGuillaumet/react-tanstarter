/**
 * Types centralisés basés sur les schémas Drizzle
 * Garantit une type safety complète de la BDD à l'applicatif
 */

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  account,
  patate,
  patateFile,
  patateFileComment,
  patateFileLike,
  patateParticipant,
  patateProblem,
  session,
  user,
  verification,
} from "~/lib/db/schema";

// ========================================
// TYPES DRIZZLE DE BASE (COMPATIBILITÉ LEGACY)
// ========================================
// Ces types sont maintenus pour la rétrocompatibilité avec l'ancien code
export type Patate = InferSelectModel<typeof patate>;
export type PatateFile = InferSelectModel<typeof patateFile>;
export type User = InferSelectModel<typeof user>;
export type Participant = InferSelectModel<typeof patateParticipant>;
export type UserPatateProblem = InferSelectModel<typeof patateProblem>;
export type PatateFileLike = InferSelectModel<typeof patateFileLike>;
export type PatateFileComment = InferSelectModel<typeof patateFileComment>;

// ========================================
// TYPES DRIZZLE MODERNES
// ========================================
// Ces types sont alignés sur la nomenclature Drizzle et facilitent les imports ciblés
export type DrizzlePatate = Patate;
export type DrizzlePatateParticipant = Participant;
export type DrizzlePatateFile = PatateFile;
export type DrizzleUser = User;
export type DrizzlePatateProblem = UserPatateProblem;
export type DrizzlePatateFileLike = PatateFileLike;
export type DrizzlePatateFileComment = PatateFileComment;
export type DrizzleAccount = InferSelectModel<typeof account>;
export type DrizzleSession = InferSelectModel<typeof session>;
export type DrizzleVerification = InferSelectModel<typeof verification>;

// Types pour les insertions
export type DrizzlePatateInsert = InferInsertModel<typeof patate>;
export type DrizzlePatateParticipantInsert = InferInsertModel<typeof patateParticipant>;
export type DrizzlePatateFileInsert = InferInsertModel<typeof patateFile>;
export type DrizzleUserInsert = InferInsertModel<typeof user>;
export type DrizzlePatateProblemsInsert = InferInsertModel<typeof patateProblem>;
export type DrizzlePatateFileLikeInsert = InferInsertModel<typeof patateFileLike>;
export type DrizzlePatateFileCommentInsert = InferInsertModel<typeof patateFileComment>;
export type DrizzleAccountInsert = InferInsertModel<typeof account>;
export type DrizzleSessionInsert = InferInsertModel<typeof session>;
export type DrizzleVerificationInsert = InferInsertModel<typeof verification>;

// ========================================
// TYPES APPLICATIFS (basés sur Drizzle)
// ========================================

// Types pour les hooks et logiques métier (directement depuis Drizzle)
export type PatateProcessStep = DrizzlePatate["processStep"];
export type ParticipantRole = DrizzlePatateParticipant["role"];

// Types utilitaires (aliases explicites)
export type ValidPatateProcessStep = PatateProcessStep;
export type ValidParticipantRole = ParticipantRole;
export type ValidPatateId = DrizzlePatate["id"];
export type ValidUserId = DrizzleUser["id"];

// Type complet d'utilisateur avec les relations Better Auth
export type UserWithAuthRelations = DrizzleUser & {
  accounts: DrizzleAccount[];
  sessions: DrizzleSession[];
  verificationTokens: DrizzleVerification[];
};

// ========================================
// TYPES LEGACY (à migrer progressivement)
// ========================================

// Types étendus avec relations (à remplacer par DrizzlePatateWithAdmin)
export type PatateWithAdmin = Patate & {
  adminId: string;
  adminName: string | null;
  adminImage: string | null;
  adminDiscordId: string;
};

// À remplacer par DrizzlePatateParticipantWithUser
export type ParticipantWithUser = Participant & {
  name: string | null;
  image: string | null;
  discordId: string;
};

// À remplacer par DrizzlePatateFileWithUser
export type PatateFileWithUser = PatateFile & {
  userName: string | null;
  userImage: string | null;
  userDiscordId: string;
};

export type PatateCreator = Pick<User, "id" | "name" | "image" | "discordId">;
export type PatateWithCreator = Patate & {
  creator: PatateCreator;
};

export type ProblemWithUser = UserPatateProblem & {
  userName: string | null;
  userImage: string | null;
  userDiscordId: string;
};

// Types pour les mutations (utilisant les types legacy pour compatibilité)
export type PatateUpdateData = Partial<
  Pick<Patate, "name" | "rules" | "theme" | "discordChannelId">
>;
export type FileCommentUpdate = { fileId: PatateFile["id"]; comment: string | null };
export type ParticipantOrderSwap = {
  patateId: Patate["id"];
  userId1: User["id"];
  userId2: User["id"];
};
export type ProblemReport = {
  patateId: Patate["id"];
  adminDiscordId: string;
  message: string;
};

// Types pour les réponses serveur (legacy)
export type ServerResponse<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export type PatateOperationResponse = ServerResponse<{
  patate?: Patate;
  completed?: boolean;
  currentUserId?: string;
  isCurrentTurnAffected?: boolean;
}>;

// Types pour les hooks de query
export type PatateQueryOptions = {
  enabled?: boolean;
  refetchInterval?: number;
};

// Type pour les participants avec ordre masqué pour les spectateurs
export type PatateParticipantWithOptionalOrder = Omit<Participant, "order"> & {
  order: number | null;
  name: string;
  image: string | null;
  discordId: string;
};

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  global_name: string | null;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export interface DiscordGuildChannel {
  id: string;
  name: string;
  type: number;
  parentId: string | null;
}

// Types spécifiques aux fonctions serveur (legacy - à migrer vers DrizzleCreatePatateInput)
export type CreatePatateInput = {
  name: string;
  rules?: string;
  theme: string;
  discordServerId: string;
  isPlayer: boolean;
};

export type ForceTurnInput = {
  patateId: number;
  userId: string;
  comment: string;
};

export type ConfirmSubmissionInput = {
  patateId: string;
};

export type ConfirmParticipationInput = {
  patateId: string;
  confirmParticipation: boolean;
};

export type UpdateFileCommentInput = {
  fileId: PatateFile["id"];
  comment: PatateFile["comment"];
};

export type DeleteFileInput = {
  fileId: PatateFile["id"];
};

// Types de réponse des fonctions serveur (legacy)
export type PatateCreationResponse = Patate;

export type TurnForceResponse = {
  message: string;
  currentUserId: string;
  problem: UserPatateProblem;
};

export type SubmissionConfirmationResponse = {
  message: string;
  completed: boolean;
};

export type ParticipationConfirmationResponse = {
  message: string;
};

export type FileOperationResponse = {
  message: string;
};

// Types pour les réponses API (compatibilité legacy)
export type ApiPatateResponse = ServerResponse<Patate>;
export type ApiPatateParticipantResponse = ServerResponse<Participant>;
export type ApiPatateFileResponse = ServerResponse<PatateFile>;
