import React, { useEffect } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import {
	getAllTodosQueryOptions,
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} from "~/integrations/query/todos.ts"

import { Input } from "~/components/input.tsx"
import { Checkbox } from "~/components/checkbox.tsx"

export const Route = createFileRoute("/")({
	component: RouteComponent,
})

function RouteComponent() {
	const [title, setTitle] = React.useState("")
	const [description, setDescription] = React.useState("")
	const [editingTodo, setEditingTodo] = React.useState<string | null>(null)
	const [editTitle, setEditTitle] = React.useState("")
	const [editDescription, setEditDescription] = React.useState("")

	const { data: todos, isPending, isError } = useQuery(
		getAllTodosQueryOptions(),
	)
	const createTodoMutation = useCreateTodoMutation()
	const deleteTodoMutation = useDeleteTodoMutation()
	const updateTodoMutation = useUpdateTodoMutation()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (title?.trim() && description?.trim()) {
			createTodoMutation.mutate({
				title,
				description,
			})
			setTitle("")
			setDescription("")
		}
	}

	useEffect(() => {
		console.log("Hello")
	}, [])

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
	const incompleteTodos = todos?.filter((todo) => !todo.completed) || []
	const totalTodos = todos?.length || 0

	if (isPending) return <div>Loading...</div>
	if (isError) return <div>Error loading data</div>

	return (
		<div>
			<div className="section">
				<h1>Todo List</h1>
				<div className="text-sm text-gray-500">
					{totalTodos} total todos • {completedTodos.length} completed •{" "}
					{incompleteTodos.length} remaining
				</div>
			</div>

			{/* Add Todo Form */}
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
							<textarea
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
							disabled={createTodoMutation.isPending ||
								!title?.trim() ||
								!description?.trim()}
						>
							{createTodoMutation.isPending ? "Adding..." : "Add Todo"}
						</button>
					</form>
				</div>
			</div>

			{/* Todos List */}
			<div className="section">
				{incompleteTodos.length > 0 && (
					<div className="mb-6">
						<h2>Active Todos ({incompleteTodos.length})</h2>
						{incompleteTodos.map((todo) => (
							<div key={todo.id} className="card">
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
													<div className="mb-2">
														<Checkbox
															label={todo.title}
															initialChecked={todo.completed}
															onChange={(_e) =>
																handleCompleteToggle(
																	todo.id,
																	todo.completed,
																)}
														/>
													</div>
													<Link
														to="/$todoId"
														params={{ todoId: todo.id }}
														className="block hover:underline ml-8"
													>
														<p className="text-gray-600 text-sm">
															{todo.description}
														</p>
													</Link>
												</div>
												<div className="button-group ml-4">
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
				)}

				{completedTodos.length > 0 && (
					<div className="mb-6">
						<h2>Completed Todos ({completedTodos.length})</h2>
						{completedTodos.map((todo) => (
							<div key={todo.id} className="card">
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
													<div className="mb-2">
														<Checkbox
															label={todo.title}
															initialChecked={todo.completed}
															onChange={(_e) =>
																handleCompleteToggle(
																	todo.id,
																	todo.completed,
																)}
														/>
													</div>
													<Link
														to="/$todoId"
														params={{ todoId: todo.id }}
														className="block hover:underline ml-8"
													>
														<p className="text-gray-600 text-sm completed">
															{todo.description}
														</p>
													</Link>
												</div>
												<div className="button-group ml-4">
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
				)}

				{totalTodos === 0 && (
					<div className="card text-center">
						<div className="text-gray-500">
							No todos yet. Add your first todo above!
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
