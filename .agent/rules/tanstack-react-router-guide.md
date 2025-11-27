---
trigger: always_on
---

# TanStack Router Guide (Condensed)

## Authenticated Routes

Use `beforeLoad` to check authentication and redirect if necessary.

```tsx
// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
})
```

Pass auth state via Router Context:
1. Define context in `__root.tsx` (`createRootRouteWithContext`).
2. Pass context in `router.tsx` (`createRouter`).
3. Inject value in `App.tsx` (`<RouterProvider context={{ auth }} />`).

## Automatic Code Splitting

Enable in `vite.config.ts`:

```ts
export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
    }),
  ],
})
```

This automatically splits:
- Components (`component`, `errorComponent`, `pendingComponent`, `notFoundComponent`)
- **Loaders are NOT split by default** (for performance).

To override per route:
```tsx
export const Route = createFileRoute('/posts')({
  codeSplitGroupings: [['loader', 'component']], // Bundle loader & component together
  // ...
})
```

## Data Loading

Use `loader` to fetch data. It runs **before** the component renders.

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params }) => fetchPost(params.postId),
  component: PostComponent,
})

function PostComponent() {
  const post = Route.useLoaderData() // Type-safe data
  return <div>{post.title}</div>
}
```

### Invalidating Data
Use `router.invalidate()` to re-run loaders.
```tsx
const router = useRouter()
await router.invalidate() // Refetches all active loaders
```

## Search Parameters

Validate search params with `validateSearch` (Zod recommended).

```tsx
const SearchSchema = z.object({
  page: z.number().default(1),
  q: z.string().optional(),
})

export const Route = createFileRoute('/search')({
  validateSearch: (search) => SearchSchema.parse(search),
})

function SearchComponent() {
  const { page, q } = Route.useSearch() // Type-safe
}
```

## Type Safety & Registration

Register your router instance for global type safety:

```tsx
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

## Server Functions (TanStack Start)

Colocate server logic with routes using `createServerFn`.

```tsx
// src/routes/posts/server.ts
export const getPosts = createServerFn({ method: 'GET' })
  .handler(async () => {
    return db.select().from(posts)
  })

// src/routes/posts/index.tsx
export const Route = createFileRoute('/posts/')({
  loader: () => getPosts(),
})
```
