import { TextareaHTMLAttributes } from "react"

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return <textarea className="bg-red-500" {...props} />
}
