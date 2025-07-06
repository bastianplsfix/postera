import { TextareaHTMLAttributes } from "react"

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return <Textarea className="bg-red-500" {...props} />
}
