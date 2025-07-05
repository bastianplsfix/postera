import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<div className="section">
				<h1>About Todo Lists</h1>
				<div className="card">
					<p>
						A simple, minimalistic todo list application built with React and
						TanStack Router.
					</p>
				</div>
			</div>

			<div className="section">
				<div className="card">
					<h2>Features</h2>
					<ul>
						<li>Create and manage multiple todo lists</li>
						<li>Add, edit, and delete todos</li>
						<li>Mark todos as complete or incomplete</li>
						<li>View individual todo details</li>
						<li>Quick add todos to your first list</li>
					</ul>
				</div>
			</div>

			<div className="section">
				<div className="card">
					<h2>Design Philosophy</h2>
					<p>
						This application demonstrates clean, functional design with minimal
						styling. The focus is on usability and structure rather than
						elaborate visual effects.
					</p>
					<p>
						Built with modern web technologies including React, TanStack Router,
						TanStack Query, and Tailwind CSS for basic styling.
					</p>
				</div>
			</div>
		</div>
	)
}
