import React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {
	getAllListsQueryOptions,
	useCreateListMutation,
	useDeleteListMutation,
	useUpdateListMutation,
} from "~/integrations/query/lists.ts"

import { getAllTodosQueryOptions } from "~/integrations/query/todos.ts"

import {
	ErrorMessage,
	ListCard,
	ListForm,
	LoadingSpinner,
} from "~/components/mod.ts"

export const Route = createFileRoute("/lists")({
	component: RouteComponent,
})

function RouteComponent() {
	const [name, setName] = React.useState("")
	const [description, setDescription] = React.useState("")
	const [editingList, setEditingList] = React.useState<string | null>(null)
	const [editName, setEditName] = React.useState("")
	const [editDescription, setEditDescription] = React.useState("")

	const { data: lists, isPending: listsLoading, isError: listsError } =
		useQuery(
			getAllListsQueryOptions(),
		)
	const { data: allTodos } = useQuery(getAllTodosQueryOptions())

	const createListMutation = useCreateListMutation()
	const deleteListMutation = useDeleteListMutation()
	const updateListMutation = useUpdateListMutation()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (name?.trim() && description?.trim()) {
			createListMutation.mutate({ name, description })
			setName("")
			setDescription("")
		}
	}

	const handleDeleteClick = (listId: string) => {
		const todosInList =
			allTodos?.filter((todo) => todo.listId === listId).length || 0
		const confirmMessage = todosInList > 0
			? `Are you sure you want to delete this list? It contains ${todosInList} todo(s) that will also be deleted.`
			: "Are you sure you want to delete this list?"

		const confirmDelete = globalThis.confirm(confirmMessage)

		if (confirmDelete) {
			deleteListMutation.mutate(listId)
		}
	}

	const handleEditClick = (
		listId: string,
		currentName: string,
		currentDescription: string,
	) => {
		setEditingList(listId)
		setEditName(currentName)
		setEditDescription(currentDescription)
	}

	const handleEditSubmit = (listId: string) => {
		if (editName?.trim() && editDescription?.trim()) {
			updateListMutation.mutate({
				listId,
				updates: { name: editName, description: editDescription },
			})
			setEditingList(null)
			setEditName("")
			setEditDescription("")
		}
	}

	const handleCancelEdit = () => {
		setEditingList(null)
		setEditName("")
		setEditDescription("")
	}

	const getTodoCount = (listId: string) => {
		return allTodos?.filter((todo) => todo.listId === listId).length || 0
	}

	const getCompletedCount = (listId: string) => {
		return allTodos?.filter((todo) => todo.listId === listId && todo.completed)
			.length || 0
	}

	if (listsLoading) return <LoadingSpinner message="Loading lists..." />
	if (listsError) return <ErrorMessage message="Error loading lists" />

	return (
		<div>
			<div className="section">
				<h1>Todo Lists</h1>
				<div className="nav-links">
					<Link to="/">← Back to Todos</Link>
				</div>
			</div>

			<div className="section">
				{lists?.map((list) => {
					const todoCount = getTodoCount(list.id)
					const completedCount = getCompletedCount(list.id)

					return (
						<ListCard
							key={list.id}
							list={list}
							stats={{ completed: completedCount, total: todoCount }}
							onEdit={handleEditClick}
							onDelete={handleDeleteClick}
							isEditing={editingList === list.id}
							editName={editName}
							editDescription={editDescription}
							onEditNameChange={setEditName}
							onEditDescriptionChange={setEditDescription}
							onSaveEdit={handleEditSubmit}
							onCancelEdit={handleCancelEdit}
							showActions
						/>
					)
				})}
			</div>

			<div className="section">
				<ListForm
					name={name}
					description={description}
					onNameChange={setName}
					onDescriptionChange={setDescription}
					onSubmit={handleSubmit}
					isSubmitting={createListMutation.isPending}
					submitButtonText="Create List"
					formTitle="Create New List"
				/>
			</div>
		</div>
	)
}
