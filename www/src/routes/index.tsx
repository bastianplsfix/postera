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

import {
	EmptyState,
	ErrorMessage,
	LoadingSpinner,
	QuickAddForm,
	TodoForm,
	TodoItem,
} from "~/components/mod.ts"

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

	if (isPending) return <LoadingSpinner />
	if (isError) return <ErrorMessage message="Error loading data" />

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
				<QuickAddForm
					title={quickAddTitle}
					description={quickAddDescription}
					onTitleChange={setQuickAddTitle}
					onDescriptionChange={setQuickAddDescription}
					onSubmit={handleQuickAddSubmit}
					isSubmitting={createTodoMutation.isPending}
					defaultListName={lists[0].name}
				/>
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
										<TodoItem
											key={todo.id}
											todo={todo}
											onEdit={handleEditClick}
											onDelete={handleDeleteClick}
											onToggleComplete={handleCompleteToggle}
											isEditing={editingTodo === todo.id}
											editTitle={editTitle}
											editDescription={editDescription}
											onEditTitleChange={setEditTitle}
											onEditDescriptionChange={setEditDescription}
											onSaveEdit={handleEditSubmit}
											onCancelEdit={handleCancelEdit}
										/>
									))}

									{listTodos.length === 0 && (
										<div className="text-center py-4 text-gray-500">
											No todos in this list yet. Add your first todo below!
										</div>
									)}
								</div>

								{/* Add Todo Form for this List */}
								<div className="border-t border-gray-100 pt-4">
									<TodoForm
										title={listInput.title}
										description={listInput.description}
										onTitleChange={(value) =>
											updateListInput(list.id, "title", value)}
										onDescriptionChange={(value) =>
											updateListInput(list.id, "description", value)}
										onSubmit={(e) => handleListAddSubmit(e, list.id)}
										isSubmitting={createTodoMutation.isPending}
										submitButtonText="Add Todo"
										formTitle={`Add Todo to ${list.name}`}
										showLabels={false}
										descriptionRows={2}
									/>
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{(!lists || lists.length === 0) && (
				<div className="section">
					<EmptyState
						title="No lists yet!"
						description="Create your first list to start organizing your todos."
						actionText="Create Your First List"
						actionLink="/lists"
					/>
				</div>
			)}
		</div>
	)
}
