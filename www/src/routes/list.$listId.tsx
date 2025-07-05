import React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import {
	EmptyState,
	ErrorMessage,
	LoadingSpinner,
	TodoForm,
	TodoItem,
} from "~/components/mod.ts"

import {
	getAllTodosQueryOptions,
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} from "~/integrations/query/todos.ts"

import { getOneListQueryOptions } from "~/integrations/query/lists.ts"

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

	if (listLoading || todosLoading) return <LoadingSpinner />
	if (listError || todosError) {
		return <ErrorMessage message="Error loading data" />
	}
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
						<div key={todo.id} className="card">
							<TodoItem
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
						</div>
					)
				})}

				{todos?.length === 0 && (
					<EmptyState
						title="No todos in this list yet"
						description="Create your first todo below!"
						showIcon={false}
					/>
				)}
			</div>

			<div className="section">
				<TodoForm
					title={title}
					description={description}
					onTitleChange={setTitle}
					onDescriptionChange={setDescription}
					onSubmit={handleSubmit}
					isSubmitting={createTodoMutation.isPending}
					submitButtonText="Add Todo"
					formTitle="Add New Todo"
				/>
			</div>
		</div>
	)
}
