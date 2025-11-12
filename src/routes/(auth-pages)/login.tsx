import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import authClient from "~/lib/auth/auth-client";

export const Route = createFileRoute("/(auth-pages)/login")({
  component: LoginForm,
});

function LoginForm() {
  const { redirectUrl } = Route.useRouteContext();

  function discordLogin() {
    authClient.signIn.social(
      {
        provider: "discord",
        callbackURL: redirectUrl,
      },
      {
        onError: (error) => {
          toast.error(`Erreur lors de la connexion: ${error.error.message}`);
        },
        onSuccess: () => {
          toast.success("Redirection vers Discord pour la connexion...");
        },
      },
    );
  }

  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      {/* Warning Alert */}
      <Alert variant="warning">
        <AlertTriangleIcon />
        <AlertTitle>Attention requise</AlertTitle>
        <AlertDescription>
          Pour acceder à cette application, vous devez vous connecter avec un compte
          discord.
        </AlertDescription>
      </Alert>
      <Button onClick={() => discordLogin()}>Se connecter</Button>
    </div>
  );
}
