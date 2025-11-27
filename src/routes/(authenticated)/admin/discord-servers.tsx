import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createDiscordServerServerFunction } from "./server/createDiscordServer.serverFunction";
import { listDiscordServersServerFunction } from "./server/listDiscordServers.serverFunction";

import { Trash } from "lucide-react";
import { deleteDiscordServerServerFunction } from "./server/deleteDiscordServer.serverFunction";
import { getDiscordServerInfoServerFunction } from "./server/getDiscordServerInfo.serverFunction";

export const Route = createFileRoute("/(authenticated)/admin/discord-servers")({
  component: DiscordServersPage,
});

function DiscordServersPage() {
  const [id, setId] = useState("");

  const queryClient = useQueryClient();

  const {
    data: servers,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["discord-servers"],
    queryFn: () => listDiscordServersServerFunction(),
  });

  const searchMutation = useMutation({
    mutationFn: getDiscordServerInfoServerFunction,
  });

  const createMutation = useMutation({
    mutationFn: createDiscordServerServerFunction,
    onSuccess: () => {
      toast.success("Serveur Discord ajouté");
      setId("");
      searchMutation.reset();
      queryClient.invalidateQueries({ queryKey: ["discord-servers"] });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout du serveur: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDiscordServerServerFunction,
    onSuccess: () => {
      toast.success("Serveur Discord supprimé");
      queryClient.invalidateQueries({ queryKey: ["discord-servers"] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression du serveur: " + error.message);
    },
  });

  const handleSubmit = () => {
    if (!searchMutation.data) return;
    createMutation.mutate({ data: { id: searchMutation.data.id } });
  };

  return (
    <div className="container mx-auto space-y-8 py-10">
      <h1 className="text-3xl font-bold">Gestion des Serveurs Discord</h1>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un serveur</CardTitle>
          <CardDescription>
            Recherchez un serveur par son ID pour l'ajouter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="id">ID du Serveur</Label>
                <Input
                  id="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="123456789..."
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => searchMutation.mutate({ data: { id } })}
                  disabled={searchMutation.isPending || !id}
                >
                  {searchMutation.isPending ? "Recherche..." : "Rechercher"}
                </Button>
              </div>
            </div>

            {searchMutation.isError && (
              <div className="rounded-md bg-red-50 p-4 text-red-500">
                <p className="font-bold">Erreur :</p>
                <p>{searchMutation.error.message}</p>
              </div>
            )}

            {searchMutation.data && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {searchMutation.data.icon ? (
                      <img
                        src={searchMutation.data.icon}
                        alt={searchMutation.data.name}
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200" />
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{searchMutation.data.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        ID: {searchMutation.data.id}
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Ajout..." : "Ajouter ce serveur"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Serveurs existants</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Chargement...</p>
          ) : isError ? (
            <div className="rounded-md bg-red-50 p-4 text-red-500">
              <p className="font-bold">Erreur lors du chargement des serveurs :</p>
              <p>{error?.message}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {servers?.map((server) => (
                <div
                  key={server.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    {server.icon && (
                      <img
                        src={server.icon}
                        alt={server.name}
                        className="h-10 w-10 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{server.name}</h3>
                      <p className="text-muted-foreground text-sm">ID: {server.id}</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      if (confirm("Êtes-vous sûr de vouloir supprimer ce serveur ?")) {
                        deleteMutation.mutate({ data: { id: server.id } });
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {servers?.length === 0 && <p>Aucun serveur configuré.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
