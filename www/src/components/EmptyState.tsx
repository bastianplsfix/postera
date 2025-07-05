import { Link } from "@tanstack/react-router"

interface EmptyStateProps {
	title: string
	description: string
	actionText?: string
	actionLink?: string
	showIcon?: boolean
}

export function EmptyState({
	title,
	description,
	actionText,
	actionLink,
	showIcon = true,
}: EmptyStateProps) {
	return (
		<div className="card text-center">
			{showIcon && (
				<div className="text-gray-400 mb-4">
					<svg
						className="w-16 h-16 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
			)}
			<p className="text-lg mb-4">{title}</p>
			<p className="mb-6 text-gray-600">{description}</p>
			{actionText && actionLink && (
				<Link to={actionLink} className="underline">
					{actionText}
				</Link>
			)}
		</div>
	)
}
