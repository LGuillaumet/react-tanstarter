import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Route as AuthenticatedRoute } from "~/routes/(authenticated)/route";
import { patateQueryOptions } from "./hooks";

export const Route = createFileRoute("/(authenticated)/(patates)/patates/")({
  component: PatatesListPage,
});

function PatatesListPage() {
  const { user } = AuthenticatedRoute.useRouteContext();
  const { data: patates, isLoading, error } = useQuery(patateQueryOptions.list());

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Chargement des patates...</div>
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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Liste des patates</h1>
          <p className="text-muted-foreground mt-2">Toutes les patates disponibles</p>
        </div>
        <Button asChild>
          <Link to="/patates/create">
            <PlusCircleIcon />
            Créer une patate
          </Link>
        </Button>
      </div>

      {!patates || patates.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4">
            Aucune patate n'a été créée pour le moment.
          </p>
          <Button asChild>
            <Link to="/patates/create">
              <PlusCircleIcon />
              Créer votre première patate
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patates.map((patate) => (
            <Link
              key={patate.id}
              to="/patates/$patateId"
              params={{ patateId: patate.id.toString() }}
              className="group"
            >
              <div className="bg-card rounded-lg border p-6 transition-all hover:shadow-md">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="group-hover:text-primary font-semibold">
                    {patate.name}
                  </h3>
                  <span className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-xs">
                    {patate.processStep}
                  </span>
                </div>

                {patate.theme && (
                  <p className="text-muted-foreground mb-2 text-sm">
                    Thème: {patate.theme}
                  </p>
                )}

                {patate.rules && (
                  <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                    {patate.rules}
                  </p>
                )}

                <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
                  {patate.startDate && (
                    <span>Début: {new Date(patate.startDate).toLocaleDateString()}</span>
                  )}
                  {patate.endDate && (
                    <span>Fin: {new Date(patate.endDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
