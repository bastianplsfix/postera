import React from "react"

interface CheckboxProps {
	checked: boolean
	onChange: (checked: boolean) => void
	children: React.ReactNode
	disabled?: boolean
}

function CheckIcon(props: React.ComponentProps<"svg">) {
	return (
		<svg
			fill="currentcolor"
			width="12"
			height="12"
			viewBox="0 0 10 10"
			{...props}
		>
			<path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
		</svg>
	)
}

export function Checkbox(
	{ checked, onChange, children, disabled = false }: CheckboxProps,
) {
	return (
		<label
			className={`flex items-center gap-2 cursor-pointer ${
				disabled ? "opacity-50 cursor-not-allowed" : ""
			}`}
		>
			<div className="relative">
				<input
					type="checkbox"
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
					disabled={disabled}
					className="sr-only"
				/>
				<div
					className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
						checked
							? "bg-blue-500 border-blue-500 text-white"
							: "bg-white border-gray-300 hover:border-gray-400"
					} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
				>
					{checked && <CheckIcon />}
				</div>
			</div>
			<span
				className={`select-none ${checked ? "line-through text-gray-500" : ""}`}
			>
				{children}
			</span>
		</label>
	)
}
