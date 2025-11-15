import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { discordService } from "~/lib/services/discordService";
import { Route as AuthenticatedRoute } from "~/routes/(authenticated)/route";
import type { DiscordGuildChannel } from "~/types";
import type { CreatePatateInput } from "./server/createPatate.serverFunction";
import { createPatateServerFunction } from "./server/createPatate.serverFunction";
import { getDiscordGuildServerFunction } from "./server/getDiscordGuild.serverFunction";
import { getDiscordGuildChannelsServerFunction } from "./server/getDiscordGuildChannels.serverFunction";

type DiscordServerOption = {
  id: string;
};

const DISCORD_SERVER_OPTIONS: DiscordServerOption[] = [
  {
    id: "482343720491155467",
  },
];

const DEFAULT_DISCORD_SERVER_ID = DISCORD_SERVER_OPTIONS[0]?.id ?? "";

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
    discordServerId: DEFAULT_DISCORD_SERVER_ID,
    discordChannelId: "",
  });

  const hasDiscordServerSelection = Boolean(formData.discordServerId);

  const {
    data: discordChannels = [],
    isLoading: isLoadingDiscordChannels,
    isError: isDiscordChannelsError,
    error: discordChannelsError,
  } = useQuery<DiscordGuildChannel[], Error>({
    queryKey: ["discordGuildChannels", formData.discordServerId],
    queryFn: () =>
      getDiscordGuildChannelsServerFunction({
        data: { guildId: formData.discordServerId },
      }),
    enabled: hasDiscordServerSelection,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data: selectedGuild, isLoading: isLoadingSelectedGuild } = useQuery({
    queryKey: ["discordGuildMetadata", formData.discordServerId],
    queryFn: () =>
      getDiscordGuildServerFunction({
        data: { guildId: formData.discordServerId },
      }),
    enabled: hasDiscordServerSelection,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });

  const selectedGuildIconUrl =
    discordService.getDiscordServerIconUrl({
      guildId: formData.discordServerId,
      iconId: selectedGuild?.icon ?? null,
      size: 96,
    }) ?? undefined;

  const selectedGuildDisplayName =
    selectedGuild?.name ??
    (formData.discordServerId
      ? `Serveur ${formData.discordServerId}`
      : "Serveur Discord");

  const selectedGuildInitial = selectedGuildDisplayName.charAt(0).toUpperCase() || "?";

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
            Serveur Discord <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedGuildIconUrl} alt={selectedGuildDisplayName} />
              <AvatarFallback>{selectedGuildInitial}</AvatarFallback>
            </Avatar>
            <select
              id="discordServerId"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.discordServerId}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  discordServerId: event.target.value,
                  discordChannelId: "",
                }))
              }
            >
              {DISCORD_SERVER_OPTIONS.length === 0 ? (
                <option value="">Aucun serveur disponible</option>
              ) : null}
              {DISCORD_SERVER_OPTIONS.map((server) => {
                const isSelected = server.id === formData.discordServerId;
                const resolvedLabel =
                  isSelected && selectedGuild?.name
                    ? `${selectedGuild.name} (${server.id})`
                    : server.id;
                return (
                  <option key={server.id} value={server.id}>
                    {resolvedLabel}
                  </option>
                );
              })}
            </select>
          </div>
          {isLoadingSelectedGuild ? (
            <p className="text-muted-foreground text-xs">
              Chargement de l'aperçu du serveur...
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discordChannelId">Canal Discord</Label>
          <select
            id="discordChannelId"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.discordChannelId ?? ""}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                discordChannelId: event.target.value,
              }))
            }
            disabled={
              !hasDiscordServerSelection ||
              isLoadingDiscordChannels ||
              isDiscordChannelsError ||
              discordChannels.length === 0
            }
          >
            {isLoadingDiscordChannels ? (
              <option value="">Chargement des canaux...</option>
            ) : null}
            {!isLoadingDiscordChannels && discordChannels.length === 0 ? (
              <option value="">Aucun canal disponible</option>
            ) : null}
            {!isLoadingDiscordChannels && discordChannels.length > 0 ? (
              <>
                <option value="" disabled>
                  Sélectionnez un canal
                </option>
                {discordChannels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name} ({channel.id})
                  </option>
                ))}
              </>
            ) : null}
          </select>
          {isDiscordChannelsError ? (
            <p className="text-destructive text-xs">
              Impossible de charger les canaux Discord :{" "}
              {discordChannelsError instanceof Error
                ? discordChannelsError.message
                : "Erreur inconnue"}
            </p>
          ) : null}
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
