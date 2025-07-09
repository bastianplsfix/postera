import React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {
	getOneTodoQueryOptions,
	useUpdateTodoMutation,
} from "~/integrations/query/todos.ts"

export const Route = createFileRoute("/$todoId")({
	component: RouteComponent,
})

import { Input } from "~/components/input.tsx"
import { Checkbox } from "~/components/checkbox.tsx"

function RouteComponent() {
	const { todoId } = Route.useParams()
	const [isEditing, setIsEditing] = React.useState(false)
	const [editTitle, setEditTitle] = React.useState("")

	const { data, isPending, isError } = useQuery(
		getOneTodoQueryOptions(todoId),
	)
	const updateTodoMutation = useUpdateTodoMutation()

	const handleCompleteToggle = (checked: boolean) => {
		if (data) {
			updateTodoMutation.mutate({
				todoId: data.id,
				updates: { completed: checked },
			})
		}
	}

	const handleEditClick = () => {
		if (data) {
			setEditTitle(data.title)
			setIsEditing(true)
		}
	}

	const handleEditSubmit = () => {
		if (editTitle?.trim()) {
			updateTodoMutation.mutate({
				todoId: todoId,
				updates: { title: editTitle },
			})
			setIsEditing(false)
		}
	}

	const handleCancelEdit = () => {
		setIsEditing(false)
		setEditTitle("")
	}

	if (isPending) return <div>Loading...</div>
	if (isError) return <div>Error loading todo</div>
	if (!data) return <div>Todo not found</div>

	return (
		<div>
			<div className="section">
				<div className="nav-links">
					<Link to="/">← Back to todos</Link>
				</div>
			</div>

			<div className="section">
				<div className="card">
					{isEditing
						? (
							<div>
								<div className="form-group">
									<label>Todo</label>
									<Input
										type="text"
										value={editTitle}
										onChange={(e) => setEditTitle(e.target.value)}
										placeholder="Todo title"
									/>
								</div>
								<div className="button-group">
									<button
										type="button"
										onClick={handleEditSubmit}
										disabled={!editTitle?.trim() ||
											updateTodoMutation.isPending}
									>
										{updateTodoMutation.isPending ? "Saving..." : "Save"}
									</button>
									<button
										type="button"
										onClick={handleCancelEdit}
									>
										Cancel
									</button>
								</div>
							</div>
						)
						: (
							<div>
								<div className="mb-6">
									<Checkbox
										checked={data.completed}
										onChange={handleCompleteToggle}
									>
										<h1 className="text-xl font-semibold">{data.title}</h1>
									</Checkbox>
								</div>

								<div className="flex gap-4 items-center mb-6">
									<span className="text-sm text-gray-600">
										Status: {data.completed ? "Completed" : "Pending"}
									</span>
									<span className="text-sm text-gray-500">
										Created: {new Date(data.createdAt).toLocaleDateString()}
									</span>
									{data.updatedAt !== data.createdAt && (
										<span className="text-sm text-gray-500">
											Updated: {new Date(data.updatedAt).toLocaleDateString()}
										</span>
									)}
								</div>

								<div className="button-group">
									<button
										type="button"
										onClick={handleEditClick}
										className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
									>
										Edit
									</button>
								</div>
							</div>
						)}
				</div>
			</div>
		</div>
	)
}
