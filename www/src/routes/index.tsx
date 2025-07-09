import React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import {
	getAllTodosQueryOptions,
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} from "~/integrations/query/todos.ts"

import { Input } from "~/components/input.tsx"

export const Route = createFileRoute("/")({
	component: RouteComponent,
})

function RouteComponent() {
	const [newTitle, setNewTitle] = React.useState("")
	const [newDescription, setNewDescription] = React.useState("")
	const [editingTodo, setEditingTodo] = React.useState<string | null>(null)
	const [editTitle, setEditTitle] = React.useState("")
	const [editDescription, setEditDescription] = React.useState("")

	const { data: todos, isPending, isError } = useQuery(
		getAllTodosQueryOptions(),
	)
	const createTodoMutation = useCreateTodoMutation()
	const deleteTodoMutation = useDeleteTodoMutation()
	const updateTodoMutation = useUpdateTodoMutation()

	const handleAddSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (newTitle?.trim() && newDescription?.trim()) {
			createTodoMutation.mutate({
				title: newTitle,
				description: newDescription,
			})
			setNewTitle("")
			setNewDescription("")
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

	const completedTodos = todos?.filter((todo) => todo.completed) || []
	const pendingTodos = todos?.filter((todo) => !todo.completed) || []

	if (isPending) return <div>Loading...</div>
	if (isError) return <div>Error loading todos</div>

	return (
		<div>
			<div className="section">
				<h1>Todo List</h1>
				<p className="text-gray-600">
					{todos?.length || 0} total todos • {completedTodos.length} completed •
					{" "}
					{pendingTodos.length} pending
				</p>
			</div>

			{/* Add Todo Form */}
			<div className="section">
				<div className="card">
					<h2>Add New Todo</h2>
					<form onSubmit={handleAddSubmit}>
						<div className="form-group">
							<label htmlFor="newTitle">Title</label>
							<Input
								id="newTitle"
								type="text"
								placeholder="Enter todo title"
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="newDescription">Description</label>
							<textarea
								id="newDescription"
								placeholder="Enter todo description"
								value={newDescription}
								onChange={(e) => setNewDescription(e.target.value)}
								rows={3}
								required
							/>
						</div>
						<button
							type="submit"
							disabled={createTodoMutation.isPending ||
								!newTitle?.trim() ||
								!newDescription?.trim()}
						>
							{createTodoMutation.isPending ? "Adding..." : "Add Todo"}
						</button>
					</form>
				</div>
			</div>

			{/* Todos List */}
			<div className="section">
				<div className="card">
					<h2>All Todos</h2>

					{todos && todos.length > 0
						? (
							<div>
								{todos.map((todo) => (
									<div
										key={todo.id}
										className="border-b border-gray-100 pb-4 mb-4 last:border-b-0"
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
													<textarea
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
												<div>
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
															<div className="text-xs text-gray-500 mt-2">
																Created:{" "}
																{new Date(todo.createdAt).toLocaleDateString()}
																{todo.completed && (
																	<span className="ml-2">
																		• Completed
																	</span>
																)}
															</div>
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
												</div>
											)}
									</div>
								))}
							</div>
						)
						: (
							<div className="text-center py-8 text-gray-500">
								<p className="text-lg mb-2">No todos yet!</p>
								<p>Add your first todo above to get started.</p>
							</div>
						)}
				</div>
			</div>
		</div>
	)
}
