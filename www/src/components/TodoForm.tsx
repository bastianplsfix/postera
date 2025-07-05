import React from "react"

interface TodoFormProps {
	title: string
	description: string
	onTitleChange: (value: string) => void
	onDescriptionChange: (value: string) => void
	onSubmit: (e: React.FormEvent) => void
	isSubmitting?: boolean
	submitButtonText?: string
	formTitle?: string
	showLabels?: boolean
	titlePlaceholder?: string
	descriptionPlaceholder?: string
	descriptionRows?: number
}

export function TodoForm({
	title,
	description,
	onTitleChange,
	onDescriptionChange,
	onSubmit,
	isSubmitting = false,
	submitButtonText = "Add Todo",
	formTitle,
	showLabels = true,
	titlePlaceholder = "Enter todo title",
	descriptionPlaceholder = "Enter todo description",
	descriptionRows = 3,
}: TodoFormProps) {
	return (
		<div className="card">
			{formTitle && <h2>{formTitle}</h2>}
			<form onSubmit={onSubmit}>
				<div className="form-group">
					{showLabels && <label htmlFor="title">Title</label>}
					<input
						id="title"
						type="text"
						placeholder={titlePlaceholder}
						value={title}
						onChange={(e) => onTitleChange(e.target.value)}
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
					disabled={isSubmitting || !title?.trim() || !description?.trim()}
				>
					{isSubmitting ? "Creating..." : submitButtonText}
				</button>
			</form>
		</div>
	)
}
