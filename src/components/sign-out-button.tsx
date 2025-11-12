import { useRouter } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import authClient from "~/lib/auth/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onResponse: async () => {
              authClient.$store.notify("$sessionSignal");
              await router.invalidate();
            },
          },
        });
      }}
      type="button"
      className="w-fit"
      variant="destructive"
      size="lg"
    >
      Sign out
    </Button>
  );
}
