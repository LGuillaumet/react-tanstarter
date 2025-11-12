import authClient from "./auth-client";

type SessionResult = ReturnType<typeof authClient.useSession>;
type SessionData = NonNullable<SessionResult["data"]>;
type SessionUser = SessionData extends { user: infer U } ? U : never;

/**
 * Hook centralisé pour accéder à l'utilisateur courant côté client.
 * S'appuie sur le client officiel Better Auth (nanostores) au lieu de React Query.
 * Retourne la même forme que précédemment : { data: User | null, error, isPending, refetch }.
 */
export function useAuth(): Omit<SessionResult, "data"> & {
  data: SessionUser | null;
} {
  const sessionState = authClient.useSession();

  return {
    ...sessionState,
    data: sessionState.data?.user ?? null,
  };
}
