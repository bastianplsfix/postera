import React from "react"
import { createFileRoute } from "@tanstack/react-router"
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
	const [editingTodo, setEditingTodo] = React.useState<string | null>(null)
	const [editTitle, setEditTitle] = React.useState("")

	const { data: todos, isPending, isError } = useQuery(
		getAllTodosQueryOptions(),
	)
	const createTodoMutation = useCreateTodoMutation()
	const deleteTodoMutation = useDeleteTodoMutation()
	const updateTodoMutation = useUpdateTodoMutation()

	const handleAddSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (newTitle?.trim()) {
			createTodoMutation.mutate({
				title: newTitle,
			})
			setNewTitle("")
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

	const handleEditClick = (todoId: string, currentTitle: string) => {
		setEditingTodo(todoId)
		setEditTitle(currentTitle)
	}

	const handleEditSubmit = (todoId: string) => {
		if (editTitle?.trim()) {
			updateTodoMutation.mutate({
				todoId,
				updates: { title: editTitle },
			})
			setEditingTodo(null)
			setEditTitle("")
		}
	}

	const handleCancelEdit = () => {
		setEditingTodo(null)
		setEditTitle("")
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
							<label htmlFor="newTitle">Todo</label>
							<Input
								id="newTitle"
								type="text"
								placeholder="Enter todo title"
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								required
							/>
						</div>
						<button
							type="submit"
							disabled={createTodoMutation.isPending || !newTitle?.trim()}
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
							<div className="space-y-2">
								{todos.map((todo) => (
									<div
										key={todo.id}
										className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
									>
										{editingTodo === todo.id
											? (
												<div className="flex-1 flex items-center gap-2">
													<Input
														type="text"
														value={editTitle}
														onChange={(e) => setEditTitle(e.target.value)}
														placeholder="Todo title"
														className="flex-1"
													/>
													<div className="flex gap-2">
														<button
															type="button"
															onClick={() => handleEditSubmit(todo.id)}
															disabled={!editTitle?.trim()}
															className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
														>
															Save
														</button>
														<button
															type="button"
															onClick={handleCancelEdit}
															className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
														>
															Cancel
														</button>
													</div>
												</div>
											)
											: (
												<div className="flex-1 flex items-center justify-between">
													<label className="flex items-center gap-2 cursor-pointer">
														<input
															type="checkbox"
															checked={todo.completed}
															onChange={() =>
																handleCompleteToggle(todo.id, todo.completed)}
															className="rounded"
														/>
														<span
															className={todo.completed
																? "line-through text-gray-500"
																: ""}
														>
															{todo.title}
														</span>
													</label>
													<div className="flex gap-2">
														<button
															type="button"
															onClick={() =>
																handleEditClick(todo.id, todo.title)}
															className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
														>
															Edit
														</button>
														<button
															type="button"
															onClick={() => handleDeleteClick(todo.id)}
															className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
														>
															Delete
														</button>
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
