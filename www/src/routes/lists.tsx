import React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {
	getAllListsQueryOptions,
	useCreateListMutation,
	useDeleteListMutation,
	useUpdateListMutation,
} from "~/integrations/query/lists.ts"
import { Button, Input, Label, Textarea } from "~/components/mod.ts"

import { getAllTodosQueryOptions } from "~/integrations/query/todos.ts"

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

	if (listsLoading) return <div>Loading lists...</div>
	if (listsError) return <div>Error loading lists</div>

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
						<div key={list.id} className="card">
							{editingList === list.id
								? (
									<div>
										<Input
											type="text"
											value={editName}
											onChange={(e) => setEditName(e.target.value)}
											placeholder="List name"
											className="mb-2"
										/>
										<Textarea
											value={editDescription}
											onChange={(e) => setEditDescription(e.target.value)}
											placeholder="List description"
											rows={2}
											className="mb-2"
										/>
										<div className="button-group">
											<Button
												onClick={() => handleEditSubmit(list.id)}
												disabled={!editName?.trim() || !editDescription?.trim()}
											>
												Save
											</Button>
											<Button
												onClick={handleCancelEdit}
											>
												Cancel
											</Button>
										</div>
									</div>
								)
								: (
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<Link
												to="/list/$listId"
												params={{ listId: list.id }}
												className="block hover:underline"
											>
												<h3 className="mb-1">{list.name}</h3>
												<p className="text-gray-600 mb-2">{list.description}</p>
												<div className="text-sm text-gray-500">
													{todoCount} todo{todoCount !== 1 ? "s" : ""}
													{todoCount > 0 && (
														<span>• {completedCount} completed</span>
													)}
												</div>
											</Link>
										</div>
										<div className="button-group ml-4">
											<Button
												onClick={() =>
													handleEditClick(list.id, list.name, list.description)}
											>
												Edit
											</Button>
											<Button
												onClick={() => handleDeleteClick(list.id)}
											>
												Delete
											</Button>
										</div>
									</div>
								)}
						</div>
					)
				})}
			</div>

			<div className="section">
				<div className="card">
					<h2>Create New List</h2>
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<Label htmlFor="name">List Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="Enter list name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
						<div className="form-group">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Enter list description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
								required
							/>
						</div>
						<Button
							type="submit"
							disabled={createListMutation.isPending || !name?.trim() ||
								!description?.trim()}
						>
							{createListMutation.isPending ? "Creating..." : "Create List"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
}
