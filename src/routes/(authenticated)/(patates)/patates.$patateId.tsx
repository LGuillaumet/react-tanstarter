import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Route as AuthenticatedRoute } from "~/routes/(authenticated)/route";
import { patateQueryOptions } from "./hooks";
import { deletePatateServerFunction } from "./server/deletePatate.serverFunction";

export const Route = createFileRoute("/(authenticated)/(patates)/patates/$patateId")({
  component: PatateDetailPage,
});

function PatateDetailPage() {
  const { user } = AuthenticatedRoute.useRouteContext();
  const { patateId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deletePatateFn = useServerFn(deletePatateServerFunction);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const parsedPatateId = Number(patateId);
  const isValidPatateId = Number.isFinite(parsedPatateId);
  const safePatateId = isValidPatateId ? parsedPatateId : 0;

  const detailQueryOptions = patateQueryOptions.detail(safePatateId);
  const {
    data: patate,
    isLoading,
    error,
  } = useQuery({
    ...detailQueryOptions,
    enabled: isValidPatateId,
  });

  if (!user) {
    return null;
  }

  if (!isValidPatateId) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive rounded-md p-4 text-sm">
          Identifiant de patate invalide.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-muted-foreground text-center text-sm">
          Chargement de la patate...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 text-destructive rounded-md p-4 text-sm">
          Erreur lors du chargement : {error.message}
        </div>
      </div>
    );
  }

  if (!patate) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-muted-foreground rounded-md border border-dashed p-12 text-center text-sm">
          Patate introuvable.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{patate.name}</h1>
          <div className="text-muted-foreground mt-2 flex items-center gap-3 text-sm">
            {patate.processStep ? (
              <Badge variant="secondary" className="uppercase">
                {patate.processStep}
              </Badge>
            ) : null}
            <span>ID : {patate.id}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {patate.createdBy === user.id ? (
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  setDeleteError(null);
                }
                setIsDeleteDialogOpen(open);
              }}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer cette patate ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible et supprimera définitivement la patate
                    et ses données associées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {deleteError ? (
                  <div className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
                    {deleteError}
                  </div>
                ) : null}
                <AlertDialogFooter>
                  <AlertDialogCancel asChild disabled={isDeleting}>
                    <Button variant="outline">Annuler</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction
                    asChild
                    onClick={async () => {
                      setIsDeleting(true);
                      setDeleteError(null);
                      try {
                        await deletePatateFn({ data: { id: patate.id } });
                        queryClient.invalidateQueries({ queryKey: ["patates"] });
                        setIsDeleteDialogOpen(false);
                        navigate({ to: "/patates" });
                      } catch (err) {
                        setDeleteError(
                          err instanceof Error
                            ? err.message
                            : "Impossible de supprimer la patate.",
                        );
                      } finally {
                        setIsDeleting(false);
                      }
                    }}
                  >
                    <Button variant="destructive" disabled={isDeleting}>
                      {isDeleting ? "Suppression..." : "Confirmer"}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
          <Button asChild variant="outline">
            <Link to="/patates">← Retour à la liste</Link>
          </Button>
        </div>
      </div>

      <div className="bg-card space-y-6 rounded-lg border p-6 shadow-sm">
        {patate.theme ? (
          <section>
            <h2 className="text-lg font-semibold">Thème</h2>
            <p className="text-muted-foreground mt-2">{patate.theme}</p>
          </section>
        ) : null}

        {patate.rules ? (
          <section>
            <h2 className="text-lg font-semibold">Règles</h2>
            <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
              {patate.rules}
            </p>
          </section>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-muted-foreground text-sm font-medium">Discord</h3>
            <div className="mt-2 space-y-1 text-sm">
              <div>
                <span className="font-semibold">Serveur :</span> {patate.discordServerId}
              </div>
              <div>
                <span className="font-semibold">Canal :</span>{" "}
                {patate.discordChannelId ?? "Non défini"}
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="text-muted-foreground text-sm font-medium">Période</h3>
            <div className="mt-2 space-y-1 text-sm">
              <div>
                <span className="font-semibold">Début :</span>{" "}
                {patate.startDate
                  ? new Date(patate.startDate).toLocaleDateString()
                  : "Non défini"}
              </div>
              <div>
                <span className="font-semibold">Fin :</span>{" "}
                {patate.endDate
                  ? new Date(patate.endDate).toLocaleDateString()
                  : "Non défini"}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
