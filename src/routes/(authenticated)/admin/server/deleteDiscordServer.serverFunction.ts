import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(authenticated)/admin/server/deleteDiscordServer/serverFunction',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/(authenticated)/admin/server/deleteDiscordServer/serverFunction"!
    </div>
  )
}
