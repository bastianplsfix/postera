import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Header } from "~/components/Header.tsx"

export const Route = createRootRoute({
	component: () => (
		<>
			<Header />
			<main className="container">
				<Outlet />
			</main>
			<ReactQueryDevtools buttonPosition="bottom-right" />
			<TanStackRouterDevtools position="bottom-left" />
		</>
	),
})
