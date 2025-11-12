import { createFileRoute } from "@tanstack/react-router";
import { LucideAlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/(auth-pages)/auth_error")({
  component: AuthErrorPage,
});

function getErrorMessage(search: URLSearchParams) {
  const error = search.get("error");
  const description = search.get("error_description");
  if (error === "access_denied") {
    return (
      <>
        <span className="text-destructive flex items-center gap-2 text-lg font-bold">
          <LucideAlertTriangle className="h-5 w-5" />
          Accès refusé
        </span>
        <span className="text-muted-foreground">
          Vous avez refusé l'autorisation ou annulé la connexion Discord.
          <br />
          Veuillez réessayer ou contacter un administrateur si le problème persiste.
        </span>
      </>
    );
  }
  return (
    <>
      <span className="text-destructive flex items-center gap-2 text-lg font-bold">
        <LucideAlertTriangle className="h-5 w-5" />
        Erreur d'authentification
      </span>
      {description && <span className="text-muted-foreground">{description}</span>}
    </>
  );
}

function AuthErrorPage() {
  const search =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  return (
    <div className={cn("bg-background flex min-h-screen items-center justify-center")}>
      <div className="bg-card flex flex-col items-center gap-4 rounded-xl border p-10 shadow-lg">
        {getErrorMessage(search)}
        <Button asChild className="mt-4">
          <a href="/signin">Retour à la connexion</a>
        </Button>
      </div>
    </div>
  );
}
