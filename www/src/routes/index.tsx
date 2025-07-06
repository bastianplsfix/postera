import React, { useEffect } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { getAllListsQueryOptions } from "~/integrations/query/lists.ts"

import {
	getAllTodosQueryOptions,
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} from "~/integrations/query/todos.ts"

import { Input, Textarea } from "~/components/mod.ts"

export const Route = createFileRoute("/")({
	component: RouteComponent,
})

function RouteComponent() {
	const [quickAddTitle, setQuickAddTitle] = React.useState("")
	const [quickAddDescription, setQuickAddDescription] = React.useState("")
	const [listInputs, setListInputs] = React.useState<
		Record<string, { title: string; description: string }>
	>({})
	const [editingTodo, setEditingTodo] = React.useState<string | null>(null)
	const [editTitle, setEditTitle] = React.useState("")
	const [editDescription, setEditDescription] = React.useState("")

	const { data: todos, isPending, isError } = useQuery(
		getAllTodosQueryOptions(),
	)
	const { data: lists } = useQuery(getAllListsQueryOptions())
	const createTodoMutation = useCreateTodoMutation()
	const deleteTodoMutation = useDeleteTodoMutation()
	const updateTodoMutation = useUpdateTodoMutation()

	const handleQuickAddSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (
			quickAddTitle?.trim() && quickAddDescription?.trim() && lists &&
			lists.length > 0
		) {
			// Create in first list by default
			createTodoMutation.mutate({
				title: quickAddTitle,
				description: quickAddDescription,
				listId: lists[0].id,
			})
			setQuickAddTitle("")
			setQuickAddDescription("")
		}
	}

	const handleListAddSubmit = (e: React.FormEvent, listId: string) => {
		e.preventDefault()
		const listInput = listInputs[listId]
		if (listInput && listInput.title?.trim() && listInput.description?.trim()) {
			createTodoMutation.mutate({
				title: listInput.title,
				description: listInput.description,
				listId,
			})
			setListInputs((prev) => ({
				...prev,
				[listId]: { title: "", description: "" },
			}))
		}
	}

	const updateListInput = (
		listId: string,
		field: "title" | "description",
		value: string,
	) => {
		setListInputs((prev) => ({
			...prev,
			[listId]: {
				...prev[listId],
				[field]: value,
			},
		}))
	}

	const getListInput = (listId: string) => {
		return listInputs[listId] || { title: "", description: "" }
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

	const getTodosByList = (listId: string) => {
		return todos?.filter((todo) => todo.listId === listId) || []
	}

	const getListStats = (listId: string) => {
		const listTodos = getTodosByList(listId)
		const completed = listTodos.filter((todo) => todo.completed).length
		const total = listTodos.length
		return { completed, total }
	}

	if (isPending) return <div>Loading...</div>
	if (isError) return <div>Error loading data</div>

	return (
		<div>
			<div className="section">
				<h1>All Todos</h1>
				<div className="nav-links">
					<Link to="/lists">Manage Lists</Link>
				</div>
			</div>

			{/* Quick Add Section */}
			{lists && lists.length > 0 && (
				<div className="section">
					<div className="card">
						<h2>Quick Add Todo</h2>
						<p className="text-sm text-gray-600 mb-4">
							This will be added to "{lists[0].name}" list. For more control,
							use the individual list sections below.
						</p>
						<form onSubmit={handleQuickAddSubmit}>
							<div className="form-group">
								<label htmlFor="quickAddTitle">Title</label>
								<Input
									id="quickAddTitle"
									type="text"
									placeholder="Enter todo title"
									value={quickAddTitle}
									onChange={(e) => setQuickAddTitle(e.target.value)}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="quickAddDescription">Description</label>
								<Textarea
									id="quickAddDescription"
									placeholder="Enter todo description"
									value={quickAddDescription}
									onChange={(e) => setQuickAddDescription(e.target.value)}
									rows={3}
									required
								/>
							</div>
							<button
								type="submit"
								disabled={createTodoMutation.isPending ||
									!quickAddTitle?.trim() ||
									!quickAddDescription?.trim()}
							>
								{createTodoMutation.isPending
									? "Creating..."
									: "Quick Add Todo"}
							</button>
						</form>
					</div>
				</div>
			)}

			{/* Lists and Todos Sections */}
			<div>
				{lists?.map((list) => {
					const listTodos = getTodosByList(list.id)
					const stats = getListStats(list.id)
					const listInput = getListInput(list.id)

					return (
						<div key={list.id} className="section">
							<div className="card">
								{/* List Header */}
								<div className="mb-6">
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<Link
												to="/list/$listId"
												params={{ listId: list.id }}
												className="hover:underline"
											>
												<h2 className="mb-1">{list.name}</h2>
											</Link>
											<p className="text-gray-600 mb-2">{list.description}</p>
											<div className="text-sm text-gray-500">
												{stats.total} todo{stats.total !== 1 ? "s" : ""}
												{stats.total > 0 && (
													<span>• {stats.completed} completed</span>
												)}
											</div>
										</div>
										<Link
											to="/list/$listId"
											params={{ listId: list.id }}
											className="text-sm underline"
										>
											View List →
										</Link>
									</div>
								</div>

								{/* Todos */}
								<div className="mb-6">
									{listTodos.map((todo) => (
										<div
											key={todo.id}
											className="border-b border-gray-100 pb-3 mb-3 last:border-b-0"
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
															onChange={(e) =>
																setEditDescription(e.target.value)}
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
																		className={todo.completed
																			? "completed"
																			: ""}
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
																		handleCompleteToggle(
																			todo.id,
																			todo.completed,
																		)}
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

									{listTodos.length === 0 && (
										<div className="text-center py-4 text-gray-500">
											No todos in this list yet. Add your first todo below!
										</div>
									)}
								</div>

								{/* Add Todo Form for this List */}
								<div className="border-t border-gray-100 pt-4">
									<h3>Add Todo to {list.name}</h3>
									<form onSubmit={(e) => handleListAddSubmit(e, list.id)}>
										<div className="form-group">
											<Input
												type="text"
												placeholder="Enter todo title"
												value={listInput.title}
												onChange={(e) =>
													updateListInput(list.id, "title", e.target.value)}
												required
											/>
										</div>
										<div className="form-group">
											<Textarea
												placeholder="Enter todo description"
												value={listInput.description}
												onChange={(e) =>
													updateListInput(
														list.id,
														"description",
														e.target.value,
													)}
												rows={2}
												required
											/>
										</div>
										<button
											type="submit"
											disabled={createTodoMutation.isPending ||
												!listInput.title?.trim() ||
												!listInput.description?.trim()}
										>
											{createTodoMutation.isPending ? "Adding..." : "Add Todo"}
										</button>
									</form>
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{(!lists || lists.length === 0) && (
				<div className="section">
					<div className="card text-center">
						<p className="text-lg mb-4">No lists yet!</p>
						<p className="mb-6">
							Create your first list to start organizing your todos.
						</p>
						<Link to="/lists" className="underline">
							Create Your First List
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}
