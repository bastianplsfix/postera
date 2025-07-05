import React from "react"
import { TodoForm } from "./TodoForm.tsx"

interface QuickAddFormProps {
	title: string
	description: string
	onTitleChange: (value: string) => void
	onDescriptionChange: (value: string) => void
	onSubmit: (e: React.FormEvent) => void
	isSubmitting?: boolean
	defaultListName?: string
}

export function QuickAddForm({
	title,
	description,
	onTitleChange,
	onDescriptionChange,
	onSubmit,
	isSubmitting = false,
	defaultListName,
}: QuickAddFormProps) {
	return (
		<div className="section">
			<TodoForm
				title={title}
				description={description}
				onTitleChange={onTitleChange}
				onDescriptionChange={onDescriptionChange}
				onSubmit={onSubmit}
				isSubmitting={isSubmitting}
				submitButtonText="Quick Add Todo"
				formTitle="Quick Add Todo"
				descriptionRows={3}
			/>
			{defaultListName && (
				<p className="text-sm text-gray-600 mt-2">
					This will be added to "{defaultListName}" list. For more control, use
					the individual list sections below.
				</p>
			)}
		</div>
	)
}
