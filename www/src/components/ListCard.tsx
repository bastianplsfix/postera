import { Link } from "@tanstack/react-router"

interface ListCardProps {
	list: {
		id: string
		name: string
		description: string
	}
	stats: {
		completed: number
		total: number
	}
	onEdit?: (id: string, name: string, description: string) => void
	onDelete?: (id: string) => void
	isEditing?: boolean
	editName?: string
	editDescription?: string
	onEditNameChange?: (value: string) => void
	onEditDescriptionChange?: (value: string) => void
	onSaveEdit?: (id: string) => void
	onCancelEdit?: () => void
	showActions?: boolean
	linkTo?: string
}

export function ListCard({
	list,
	stats,
	onEdit,
	onDelete,
	isEditing = false,
	editName = "",
	editDescription = "",
	onEditNameChange,
	onEditDescriptionChange,
	onSaveEdit,
	onCancelEdit,
	showActions = false,
	linkTo = "/list/$listId",
}: ListCardProps) {
	const handleDeleteClick = () => {
		const confirmMessage = stats.total > 0
			? `Are you sure you want to delete this list? It contains ${stats.total} todo(s) that will also be deleted.`
			: "Are you sure you want to delete this list?"

		const confirmDelete = globalThis.confirm(confirmMessage)
		if (confirmDelete && onDelete) {
			onDelete(list.id)
		}
	}

	if (isEditing) {
		return (
			<div className="card">
				<div>
					<input
						type="text"
						value={editName}
						onChange={(e) => onEditNameChange?.(e.target.value)}
						placeholder="List name"
						className="mb-2"
					/>
					<textarea
						value={editDescription}
						onChange={(e) => onEditDescriptionChange?.(e.target.value)}
						placeholder="List description"
						rows={2}
						className="mb-2"
					/>
					<div className="button-group">
						<button
							type="button"
							onClick={() => onSaveEdit?.(list.id)}
							disabled={!editName?.trim() || !editDescription?.trim()}
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
		<div className="card">
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<Link
						to={linkTo}
						params={{ listId: list.id }}
						className="block hover:underline"
					>
						<h3 className="mb-1">{list.name}</h3>
						<p className="text-gray-600 mb-2">{list.description}</p>
						<div className="text-sm text-gray-500">
							{stats.total} todo{stats.total !== 1 ? "s" : ""}
							{stats.total > 0 && <span>• {stats.completed} completed</span>}
						</div>
					</Link>
				</div>
				{showActions && (
					<div className="button-group ml-4">
						<button
							type="button"
							onClick={() => onEdit?.(list.id, list.name, list.description)}
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
				)}
			</div>
		</div>
	)
}
