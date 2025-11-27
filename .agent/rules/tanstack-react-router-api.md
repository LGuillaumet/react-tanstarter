---
trigger: always_on
---

# TanStack Router API (Condensed)

## Core Functions

### `createRouter`
Creates a new router instance.
```tsx
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
})
```

### `createFileRoute`
Creates a file-based route.
```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params }) => fetchPost(params.postId),
  component: PostComponent,
})
```

### `createRootRoute` / `createRootRouteWithContext`
Creates the root route, optionally with type-safe context.
```tsx
export const Route = createRootRouteWithContext<{ auth: AuthState }>()({
  component: () => <Outlet />,
})
```

## Route Options

The object passed to `createFileRoute` or `createRoute`.

- **`loader`**: `(opts) => Promise<T>` - Fetches data for the route.
- **`component`**: `React.Component` - Renders when the route matches.
- **`errorComponent`**: `React.Component` - Renders when loader throws.
- **`pendingComponent`**: `React.Component` - Renders while loader is pending (after `pendingMs`).
- **`notFoundComponent`**: `React.Component` - Renders when route is not found.
- **`beforeLoad`**: `(opts) => Promise<void> | void` - Runs before loader. Used for auth/redirects.
- **`validateSearch`**: `(search) => T` - Validates and types search params (zod recommended).
- **`loaderDeps`**: `(opts) => deps` - Dependencies that trigger loader reload.

## Hooks

- **`useRouter()`**: Returns the router instance.
- **`useParams()`**: Returns typed route parameters.
- **`useSearch()`**: Returns typed search parameters.
- **`useLoaderData()`**: Returns data returned by the loader.
- **`useRouteContext()`**: Returns context available to the route.
- **`useNavigate()`**: Returns a `navigate` function.
- **`useLocation()`**: Returns the current location object.

## Types

### `LinkOptions`
Props for `<Link />` component.
- **`to`**: Target route path (e.g., `/posts/$postId`).
- **`params`**: Object matching route params.
- **`search`**: Object matching route search params.
- **`activeProps`**: Props applied when link is active.
- **`preload`**: `'intent' | 'render' | 'viewport' | false`.

### `NavigateOptions`
Options for `navigate()` function.
- **`to`**, **`params`**, **`search`** (same as Link).
- **`replace`**: Replace history entry.
- **`viewTransition`**: Use View Transitions API.

## Server Functions (`server.handlers`)

For API routes in TanStack Start.

```tsx
export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return json({ users: [] })
      },
      POST: async ({ request }) => {
        const data = await request.json()
        return json({ success: true })
      }
    }
  }
})
```
