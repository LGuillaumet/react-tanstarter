/**
 * Types centralisés basés sur les schémas Drizzle
 * Garantit une type safety complète de la BDD à l'applicatif
 */

import { InferSelectModel } from "drizzle-orm";
import { patate, patateFile, patateParticipant, user, patateProblem, patateFileLike, patateFileComment } from "~/lib/db/schema";

// ========================================
// TYPES DRIZZLE DE BASE (COMPATIBILITÉ LEGACY)
// ========================================
// Ces types sont maintenus pour la rétrocompatibilité avec l'ancien code
export type PatateFile = InferSelectModel<typeof patateFile>;
export type Patate = InferSelectModel<typeof patate>;
export type User = InferSelectModel<typeof user>;
export type Participant = InferSelectModel<typeof patateParticipant>;
export type UserPatateProblem = InferSelectModel<typeof patateProblem>;
export type PatateFileLike = InferSelectModel<typeof patateFileLike>;
export type PatateFileComment = InferSelectModel<typeof patateFileComment>;

// ========================================
// TYPES DRIZZLE MODERNES 
// ========================================
// Réexportation des types centralisés depuis le module server
export type {
    // Types Drizzle de base
    DrizzlePatate,
    DrizzlePatateParticipant,
    DrizzlePatateFile,
    DrizzleUser,
    DrizzlePatateProblem,
    DrizzlePatateFileLike,
    DrizzlePatateFileComment,

    // Types pour les insertions
    DrizzlePatateInsert,
    DrizzlePatateParticipantInsert,
    DrizzlePatateFileInsert,
    DrizzleUserInsert,
    DrizzlePatateProblemsInsert,

    // Types avec relations (aliases pour éviter conflits)
    PatateWithAdmin as DrizzlePatateWithAdmin,
    PatateParticipantWithUser as DrizzlePatateParticipantWithUser,
    PatateFileWithUser as DrizzlePatateFileWithUser,
    PatateProblemsWithUser,

    // Types issus des server functions
    GetPatateDataResult,
    PatateWithRelations,
    PatateParticipantWithUserFromQuery,
    CurrentUserPatateData,
    PreviousParticipantFiles,
    PatatePermissions,

    // Types pour les inputs de server functions
    CreatePatateInput as DrizzleCreatePatateInput,
    CreatePatateParticipantInput,
    CreatePatateFileInput,
    UpdatePatateInput as DrizzleUpdatePatateInput,
    UpdatePatateParticipantInput,
    UpdatePatateFileInput,

    // Types utilitaires
    ValidPatateProcessStep,
    ValidParticipantRole,
    ValidPatateId,
    ValidUserId,

    // Types pour les réponses API
    ApiPatateResponse,
    ApiPatateParticipantResponse,
    ApiPatateFileResponse
} from "~/lib/server/patate/types";

// Import pour utiliser dans les types suivants
import type { DrizzlePatate, DrizzlePatateParticipant } from "~/lib/server/patate/types";

// ========================================
// TYPES APPLICATIFS (basés sur Drizzle)
// ========================================

// Types pour les hooks et logiques métier (directement depuis Drizzle)
export type PatateProcessStep = DrizzlePatate["processStep"];
export type ParticipantRole = DrizzlePatateParticipant["role"];

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

export type ProblemWithUser = UserPatateProblem & {
    userName: string | null;
    userImage: string | null;
    userDiscordId: string;
};

// Types pour les mutations (utilisant les types legacy pour compatibilité)
export type PatateUpdateData = Partial<Pick<Patate, 'name' | 'rules' | 'theme' | 'discordChannelId'>>;
export type FileCommentUpdate = { fileId: PatateFile['id']; comment: string | null };
export type ParticipantOrderSwap = { patateId: Patate['id']; userId1: User['id']; userId2: User['id'] };
export type ProblemReport = { patateId: Patate['id']; adminDiscordId: string; message: string };

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
export type PatateParticipantWithOptionalOrder = Omit<Participant, 'order'> & {
    order: number | null;
    name: string;
    image: string | null;
    discordId: string;
};

export interface DiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    features: string[];
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
    fileId: PatateFile['id'];
    comment: PatateFile['comment'];
};

export type DeleteFileInput = {
    fileId: PatateFile['id'];
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