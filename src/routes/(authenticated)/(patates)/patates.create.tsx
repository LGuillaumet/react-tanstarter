import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { discordService } from "~/lib/services/discordService";
import { listDiscordServersServerFunction } from "~/routes/(authenticated)/admin/server/listDiscordServers.serverFunction";
import { Route as AuthenticatedRoute } from "~/routes/(authenticated)/route";
import type { DiscordGuildChannel } from "~/types";
import type { CreatePatateInput } from "./server/createPatate.serverFunction";
import { createPatateServerFunction } from "./server/createPatate.serverFunction";
import { getDiscordGuildChannelsServerFunction } from "./server/getDiscordGuildChannels.serverFunction";

export const Route = createFileRoute("/(authenticated)/(patates)/patates/create")({
  component: CreatePatatePage,
  headers: async () => ({
    title: "Créer une patate",
    description: "Créez une nouvelle partie de patate chaude",
  }),
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

  const hasDiscordServerSelection = Boolean(formData.discordServerId);

  // Fetch registered Discord servers from DB
  const { data: servers = [], isLoading: isLoadingServers } = useQuery({
    queryKey: ["discord-servers"],
    queryFn: () => listDiscordServersServerFunction(),
  });

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

  const selectedServer = servers.find((s) => s.id === formData.discordServerId);

  const selectedGuildIconUrl =
    discordService.getDiscordServerIconUrl({
      guildId: formData.discordServerId,
      iconId: selectedServer?.icon ?? null,
      size: 96,
    }) ?? undefined;

  const selectedGuildDisplayName =
    selectedServer?.name ??
    (formData.discordServerId
      ? `Serveur ${formData.discordServerId}`
      : "Serveur Discord");

  const selectedGuildInitial = selectedGuildDisplayName.charAt(0).toUpperCase() || "?";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isServerSelectDisabled = isLoadingServers || servers.length === 0;
  const serverSelectPlaceholder = isLoadingServers
    ? "Chargement des serveurs..."
    : servers.length === 0
      ? "Aucun serveur disponible"
      : "Sélectionnez un serveur";

  const isChannelSelectDisabled =
    !hasDiscordServerSelection ||
    isLoadingDiscordChannels ||
    isDiscordChannelsError ||
    discordChannels.length === 0;

  const channelSelectPlaceholder = !hasDiscordServerSelection
    ? "Choisissez d'abord un serveur"
    : isLoadingDiscordChannels
      ? "Chargement des canaux..."
      : discordChannels.length === 0
        ? "Aucun canal disponible"
        : "Sélectionnez un canal";

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
            <Select
              value={formData.discordServerId || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  discordServerId: value,
                  discordChannelId: "",
                }))
              }
              disabled={isServerSelectDisabled}
            >
              <SelectTrigger className="w-full" id="discordServerId">
                <SelectValue placeholder={serverSelectPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {servers.length === 0 ? (
                  <SelectItem value="__no-server" disabled>
                    Aucun serveur disponible
                  </SelectItem>
                ) : (
                  servers.map((server) => {
                    const iconUrl =
                      discordService.getDiscordServerIconUrl({
                        guildId: server.id,
                        iconId: server.icon ?? null,
                        size: 64,
                      }) ?? undefined;

                    return (
                      <SelectItem key={server.id} value={server.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={iconUrl} alt={server.name} />
                            <AvatarFallback>
                              {server.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{server.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discordChannelId">Canal Discord</Label>
          <Select
            value={formData.discordChannelId ?? ""}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                discordChannelId: value,
              }))
            }
            disabled={isChannelSelectDisabled}
          >
            <SelectTrigger className="w-full" id="discordChannelId">
              <SelectValue placeholder={channelSelectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {discordChannels.length === 0 ? (
                <SelectItem value="__no-channel" disabled>
                  {channelSelectPlaceholder}
                </SelectItem>
              ) : (
                discordChannels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name} ({channel.id})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
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
