import { ButtonHTMLAttributes } from "react"

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
	return <button type="button" className="bg-red-500" {...props} />
}
