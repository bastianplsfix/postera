import { Link } from "@tanstack/react-router"

interface TodoItemProps {
	todo: {
		id: string
		title: string
		description: string
		completed: boolean
		createdAt: string
		listId: string
	}
	onEdit: (id: string, title: string, description: string) => void
	onDelete: (id: string) => void
	onToggleComplete: (id: string, completed: boolean) => void
	isEditing: boolean
	editTitle: string
	editDescription: string
	onEditTitleChange: (value: string) => void
	onEditDescriptionChange: (value: string) => void
	onSaveEdit: (id: string) => void
	onCancelEdit: () => void
}

export function TodoItem({
	todo,
	onEdit,
	onDelete,
	onToggleComplete,
	isEditing,
	editTitle,
	editDescription,
	onEditTitleChange,
	onEditDescriptionChange,
	onSaveEdit,
	onCancelEdit,
}: TodoItemProps) {
	const handleDeleteClick = () => {
		const confirmDelete = globalThis.confirm(
			"Are you sure you want to delete this todo?",
		)
		if (confirmDelete) {
			onDelete(todo.id)
		}
	}

	if (isEditing) {
		return (
			<div className="border-b border-gray-100 pb-3 mb-3 last:border-b-0">
				<div>
					<input
						type="text"
						value={editTitle}
						onChange={(e) => onEditTitleChange(e.target.value)}
						placeholder="Todo title"
						className="mb-2"
					/>
					<textarea
						value={editDescription}
						onChange={(e) => onEditDescriptionChange(e.target.value)}
						placeholder="Todo description"
						rows={2}
						className="mb-2"
					/>
					<div className="button-group">
						<button
							type="button"
							onClick={() => onSaveEdit(todo.id)}
							disabled={!editTitle?.trim() || !editDescription?.trim()}
						>
							Save
						</button>
						<button
							type="button"
							onClick={onCancelEdit}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="border-b border-gray-100 pb-3 mb-3 last:border-b-0">
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<Link
						to="/$todoId"
						params={{ todoId: todo.id }}
						className="block hover:underline"
					>
						<div className={todo.completed ? "completed" : ""}>
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
						onClick={() => onToggleComplete(todo.id, todo.completed)}
					>
						{todo.completed ? "Undo" : "Complete"}
					</button>
					<button
						type="button"
						onClick={() => onEdit(todo.id, todo.title, todo.description)}
					>
						Edit
					</button>
					<button
						type="button"
						onClick={handleDeleteClick}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	)
}
