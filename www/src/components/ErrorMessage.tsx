interface ErrorMessageProps {
	message?: string
	title?: string
}

export function ErrorMessage({
	message = "An error occurred",
	title = "Error",
}: ErrorMessageProps) {
	return (
		<div className="text-red-600">
			<h3 className="font-semibold mb-1">{title}</h3>
			<p>{message}</p>
		</div>
	)
}
