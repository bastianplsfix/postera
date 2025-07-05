import { Link } from "@tanstack/react-router"

export function Header() {
	return (
		<header className="border-b border-gray-200">
			<div className="container">
				<div className="flex justify-between items-center py-4">
					<h1 className="text-xl font-semibold">Todo Lists</h1>
					<nav className="nav-links">
						<Link
							to="/"
							className="[&.active]:font-semibold"
						>
							All Todos
						</Link>
						<Link
							to="/lists"
							className="[&.active]:font-semibold"
						>
							Manage Lists
						</Link>
						<Link
							to="/about"
							className="[&.active]:font-semibold"
						>
							About
						</Link>
					</nav>
				</div>
			</div>
		</header>
	)
}
