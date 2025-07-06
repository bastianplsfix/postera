import { InputHTMLAttributes } from "react"

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
	return <input className="bg-red-500" {...props} />
}
