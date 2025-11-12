import { toast } from "sonner";
import authClient from "~/lib/auth/auth-client";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export function DiscordSignInButton({
  redirectUrl,
  className,
  ...props
}: SignInButtonProps) {
  async function handleSignIn() {
    await authClient.signIn.social(
      {
        provider: "discord",
        callbackURL: redirectUrl,
      },
      {
        onError: (ctx) => {
          toast.error(`Error during sign-in: ${ctx.error.message}`);
        },
        onSuccess: () => {
          toast.success("Redirecting to Discord for sign-in...");
        },
      },
    );
  }
  return (
    <Button
      onClick={handleSignIn}
      type="button"
      variant="outline"
      size="lg"
      className={cn("text-white hover:text-white", className)}
      {...props}
    >
      Se connecter avec Discord
    </Button>
  );
}
interface SignInButtonProps extends React.ComponentProps<typeof Button> {
  redirectUrl?: string;
  className?: string;
}
