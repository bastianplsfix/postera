import React from "react"

interface ListFormProps {
	name: string
	description: string
	onNameChange: (value: string) => void
	onDescriptionChange: (value: string) => void
	onSubmit: (e: React.FormEvent) => void
	isSubmitting?: boolean
	submitButtonText?: string
	formTitle?: string
	showLabels?: boolean
	namePlaceholder?: string
	descriptionPlaceholder?: string
	descriptionRows?: number
}

export function ListForm({
	name,
	description,
	onNameChange,
	onDescriptionChange,
	onSubmit,
	isSubmitting = false,
	submitButtonText = "Create List",
	formTitle,
	showLabels = true,
	namePlaceholder = "Enter list name",
	descriptionPlaceholder = "Enter list description",
	descriptionRows = 3,
}: ListFormProps) {
	return (
		<div className="card">
			{formTitle && <h2>{formTitle}</h2>}
			<form onSubmit={onSubmit}>
				<div className="form-group">
					{showLabels && <label htmlFor="name">List Name</label>}
					<input
						id="name"
						type="text"
						placeholder={namePlaceholder}
						value={name}
						onChange={(e) => onNameChange(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					{showLabels && <label htmlFor="description">Description</label>}
					<textarea
						id="description"
						placeholder={descriptionPlaceholder}
						value={description}
						onChange={(e) => onDescriptionChange(e.target.value)}
						rows={descriptionRows}
						required
					/>
				</div>
				<button
					type="submit"
					disabled={isSubmitting || !name?.trim() || !description?.trim()}
				>
					{isSubmitting ? "Creating..." : submitButtonText}
				</button>
			</form>
		</div>
	)
}
