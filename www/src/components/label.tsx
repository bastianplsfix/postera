import { LabelHTMLAttributes } from "react"

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
	return <label className="bg-red-500" {...props} />
}
