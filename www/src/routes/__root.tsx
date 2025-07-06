import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Link } from "~/components/mod.ts"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export const Route = createRootRoute({
	component: () => (
		<>
			<header className="border-b border-gray-200">
				<div className="container">
					<div className="flex justify-between items-center py-4">
						<h1 className="text-xl font-semibold">Todo Lists</h1>
						<nav className="nav-links">
							<Link
								to="/"
								variant="default"
								className="[&.active]:font-semibold"
							>
								All Todos
							</Link>
							<Link
								to="/lists"
								variant="primary"
								className="[&.active]:font-semibold"
							>
								Manage Lists
							</Link>
							<Link
								to="/about"
								variant="primary"
								className="[&.active]:font-semibold"
							>
								About
							</Link>
						</nav>
					</div>
				</div>
			</header>
			<main className="container">
				<Outlet />
			</main>
			<ReactQueryDevtools buttonPosition="bottom-right" />
			<TanStackRouterDevtools position="bottom-left" />
		</>
	),
})
