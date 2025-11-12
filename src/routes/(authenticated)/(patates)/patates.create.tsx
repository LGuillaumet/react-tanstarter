import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Route as AuthenticatedRoute } from "~/routes/(authenticated)/route";
import type { CreatePatateInput } from "./server/createPatate.serverFunction";
import { createPatateServerFunction } from "./server/createPatate.serverFunction";

export const Route = createFileRoute("/(authenticated)/(patates)/patates/create")({
  component: CreatePatatePage,
});

function CreatePatatePage() {
  const { user } = AuthenticatedRoute.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createPatateFn = useServerFn(createPatateServerFunction);

  const [formData, setFormData] = useState<CreatePatateInput>({
    name: "",
    rules: "",
    theme: "",
    discordServerId: "",
    discordChannelId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formData.name || !formData.discordServerId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createPatateFn({
        data: {
          name: formData.name,
          discordServerId: formData.discordServerId,
          rules: formData.rules || undefined,
          theme: formData.theme || undefined,
          discordChannelId: formData.discordChannelId || undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["patates"] });
      navigate({ to: "/patates" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Créer une patate</h1>
        <p className="text-muted-foreground mt-2">
          Créez une nouvelle partie de patate chaude
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nom de la patate <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            placeholder="Ex: Patate créative #1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Thème</Label>
          <Input
            id="theme"
            value={formData.theme || ""}
            onChange={(event) => setFormData({ ...formData, theme: event.target.value })}
            placeholder="Ex: Science-fiction"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rules">Règles</Label>
          <Textarea
            id="rules"
            rows={6}
            value={formData.rules || ""}
            onChange={(event) => setFormData({ ...formData, rules: event.target.value })}
            placeholder="Décrivez les règles de la patate..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discordServerId">
            ID du serveur Discord <span className="text-destructive">*</span>
          </Label>
          <Input
            id="discordServerId"
            required
            value={formData.discordServerId}
            onChange={(event) =>
              setFormData({ ...formData, discordServerId: event.target.value })
            }
            placeholder="123456789012345678"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discordChannelId">ID du canal Discord</Label>
          <Input
            id="discordChannelId"
            value={formData.discordChannelId || ""}
            onChange={(event) =>
              setFormData({
                ...formData,
                discordChannelId: event.target.value,
              })
            }
            placeholder="123456789012345678"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Création..." : "Créer la patate"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/patates" })}
            className="w-full"
          >
            Annuler
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-md p-4 text-sm">
            Erreur lors de la création : {error}
          </div>
        )}
      </form>
    </div>
  );
}
