import React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { getOneListQueryOptions } from "~/integrations/query/lists.ts"
import {
	getAllTodosQueryOptions,
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} from "~/integrations/query/todos.ts"

import { Input, Textarea } from "~/components/mod.ts"

export const Route = createFileRoute("/list/$listId")({
	component: RouteComponent,
})

function RouteComponent() {
	const { listId } = Route.useParams()
	const [title, setTitle] = React.useState("")
	const [description, setDescription] = React.useState("")
	const [editingTodo, setEditingTodo] = React.useState<string | null>(null)
	const [editTitle, setEditTitle] = React.useState("")
	const [editDescription, setEditDescription] = React.useState("")

	const { data: list, isPending: listLoading, isError: listError } = useQuery(
		getOneListQueryOptions(listId),
	)
	const { data: todos, isPending: todosLoading, isError: todosError } =
		useQuery(
			getAllTodosQueryOptions(listId),
		)

	const createTodoMutation = useCreateTodoMutation()
	const deleteTodoMutation = useDeleteTodoMutation()
	const updateTodoMutation = useUpdateTodoMutation()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (title?.trim() && description?.trim()) {
			createTodoMutation.mutate({ title, description, listId })
			setTitle("")
			setDescription("")
		}
	}

	const handleDeleteClick = (todoId: string) => {
		const confirmDelete = globalThis.confirm(
			"Are you sure you want to delete this todo?",
		)

		if (confirmDelete) {
			deleteTodoMutation.mutate(todoId)
		}
	}

	const handleCompleteToggle = (todoId: string, completed: boolean) => {
		updateTodoMutation.mutate({
			todoId,
			updates: { completed: !completed },
		})
	}

	const handleEditClick = (
		todoId: string,
		currentTitle: string,
		currentDescription: string,
	) => {
		setEditingTodo(todoId)
		setEditTitle(currentTitle)
		setEditDescription(currentDescription)
	}

	const handleEditSubmit = (todoId: string) => {
		if (editTitle?.trim() && editDescription?.trim()) {
			updateTodoMutation.mutate({
				todoId,
				updates: { title: editTitle, description: editDescription },
			})
			setEditingTodo(null)
			setEditTitle("")
			setEditDescription("")
		}
	}

	const handleCancelEdit = () => {
		setEditingTodo(null)
		setEditTitle("")
		setEditDescription("")
	}

	if (listLoading || todosLoading) return <div>Loading...</div>
	if (listError || todosError) return <div>Error loading data</div>
	if (!list) return <div>List not found</div>

	const completedCount = todos?.filter((todo) => todo.completed).length || 0
	const totalCount = todos?.length || 0

	return (
		<div>
			<div className="section">
				<div className="flex justify-between items-start mb-4">
					<div className="flex-1">
						<h1 className="mb-1">{list.name}</h1>
						<p className="text-gray-600 mb-2">{list.description}</p>
					</div>
					<div className="text-right">
						<div className="text-sm text-gray-500">
							{completedCount} of {totalCount} completed
						</div>
					</div>
				</div>
				<div className="nav-links">
					<Link to="/lists">← Back to Lists</Link>
					<Link to="/">All Todos</Link>
				</div>
			</div>

			<div className="section">
				{todos?.map((todo) => {
					return (
						<div
							key={todo.id}
							className="card"
						>
							{editingTodo === todo.id
								? (
									<div>
										<Input
											type="text"
											value={editTitle}
											onChange={(e) => setEditTitle(e.target.value)}
											placeholder="Todo title"
											className="mb-2"
										/>
										<Textarea
											value={editDescription}
											onChange={(e) => setEditDescription(e.target.value)}
											placeholder="Todo description"
											rows={2}
											className="mb-2"
										/>
										<div className="button-group">
											<button
												type="button"
												onClick={() => handleEditSubmit(todo.id)}
												disabled={!editTitle?.trim() ||
													!editDescription?.trim()}
											>
												Save
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
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<Link
												to="/$todoId"
												params={{ todoId: todo.id }}
												className="block hover:underline"
											>
												<div
													className={todo.completed ? "completed" : ""}
												>
													<h3 className="mb-1">{todo.title}</h3>
													<p className="text-gray-600 text-sm">
														{todo.description}
													</p>
												</div>
											</Link>
										</div>
										<div className="button-group ml-4">
											<button
												type="button"
												onClick={() =>
													handleCompleteToggle(todo.id, todo.completed)}
											>
												{todo.completed ? "Undo" : "Complete"}
											</button>
											<button
												type="button"
												onClick={() =>
													handleEditClick(
														todo.id,
														todo.title,
														todo.description,
													)}
											>
												Edit
											</button>
											<button
												type="button"
												onClick={() => handleDeleteClick(todo.id)}
											>
												Delete
											</button>
										</div>
									</div>
								)}
						</div>
					)
				})}

				{todos?.length === 0 && (
					<div className="card text-center">
						<div className="text-gray-500">
							No todos in this list yet. Create your first todo below!
						</div>
					</div>
				)}
			</div>

			<div className="section">
				<div className="card">
					<h2>Add New Todo</h2>
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label htmlFor="title">Title</label>
							<Input
								id="title"
								type="text"
								placeholder="Enter todo title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="description">Description</label>
							<Textarea
								id="description"
								placeholder="Enter todo description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
								required
							/>
						</div>
						<button
							type="submit"
							disabled={createTodoMutation.isPending || !title?.trim() ||
								!description?.trim()}
						>
							{createTodoMutation.isPending ? "Creating..." : "Add Todo"}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
