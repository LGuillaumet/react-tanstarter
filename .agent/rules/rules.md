---
trigger: always_on
---

# Règles Antigravity (Condensé)

## 🎯 Stack Technique
- **Framework**: TanStack Start (React 19, Compiler)
- **Langage**: TypeScript (Strict Mode)
- **UI**: shadcn/ui, Tailwind CSS v4 (Variables CSS)
- **DB**: Drizzle ORM, PostgreSQL
- **Auth**: Better Auth
- **State**: TanStack Query
- **Routing**: TanStack Router
- **Pkg Mgr**: pnpm

## 🚀 Démarrage
- **Base de données**: `docker compose up -d` (PostgreSQL sur port 5432)
- **Développement**: `pnpm dev` (Lance le serveur de dev)

## 📐 TypeScript & Conventions
- **Mode Strict**: `strict`, `noImplicitAny`. Jamais `any` (utiliser `unknown`).
- **Aliases**: Toujours utiliser `~/*` (`~/components`, `~/lib`, etc.). Pas de chemins relatifs.
- **Nommage**:
  - Fichiers: `kebab-case` (ex: `user-profile.tsx`)
  - Composants/Types: `PascalCase`
  - Hooks/Fonctions: `camelCase`
  - DB: `snake_case`

## 🗄️ Drizzle ORM
- **Types**: Utiliser types inférés (`InferSelectModel`). Pas de types manuels.
- **Schémas**: `src/lib/db/schema/`. Exporter les types depuis les schémas.

## ⚛️ React & UI
- **Composants**: Fonctionnels uniquement. Props typées (`React.ComponentProps`).
- **Compiler**: Pas de `useMemo`/`useCallback` sauf nécessité absolue.
- **Styles**: Tailwind v4. Utiliser `cn()` pour fusionner classes. Variantes avec `cva`.
- **Couleurs**: Utiliser variables CSS (`src/styles.css`). Jamais de couleurs hardcodées.

## 🛣️ TanStack Router
- **Structure**: `src/routes/`.
  - Racine: `__root.tsx`
  - Index: `index.tsx`
  - Layouts: `route.tsx` (dans dossier) ou groupes `(group)/route.tsx`.
- **Fichiers**: `createFileRoute`. Paramètres typés auto.
- **Data**: `beforeLoad` pour auth/prefetch (`ensureQueryData`).
- **API**: `api/route.ts` avec `server.handlers`.

## 🔐 Authentification (Better Auth)
- **Client**: `authClient` (`useSession`, `signIn`). Jamais `auth.api`.
- **Serveur**: Exposer via `createServerFn` (ex: `getUser`).
- **Sécurité**: Ne pas importer `@tanstack/react-start/server` dans le client.

## 🖥️ Server Functions (`createServerFn`)
- **Pattern**: Colocaliser avec routes (`src/routes/.../server/`).
- **Validation**: **OBLIGATOIRE** `inputValidator` (Zod recommandé).
- **POST**: `.inputValidator(Schema).handler({ data })`.
- **GET**: Options `{ signal }` pour queries.
- **Client**: Appeler via `useServerFn`. Gérer erreurs `try/catch`.
- **Server-Only**: `createServerOnlyFn` pour DB/Env secrets.

## 📦 Env & Deps
- **Env**: Validées par Zod (`@t3-oss/env-core`).
  - Serveur: `src/env/server.ts`
  - Client: `src/env/client.ts` (`VITE_`).
- **Manager**: `pnpm` uniquement.

## 🚫 Anti-Patterns
1. Chemins relatifs (`../`).
2. `any` ou `@ts-ignore` sans raison.
3. Types DB manuels.
4. Couleurs hardcodées.
5. `React.FC`.
6. Server code dans client bundle.

## 🔍 Qualité
- `pnpm check` (Format + Lint + Types) avant commit.
- Documentation JSDoc pour logique complexe.
