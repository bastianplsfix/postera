import React from "react"
import { motion, useSpring } from "motion/react"
import { CheckIcon } from "../assets/svg.tsx"
import { Checkbox as Base } from "@base-ui-components/react/checkbox"

export function ExampleCheckbox() {
	return (
		<label className="flex items-center gap-2 text-base text-gray-900">
			<Base.Root
				defaultChecked
				className="flex size-5 items-center justify-center rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-[checked]:bg-gray-900 data-[unchecked]:border data-[unchecked]:border-gray-300"
			>
				<Base.Indicator className="flex text-gray-50 data-[unchecked]:hidden">
					<CheckIcon className="stroke-2" />
				</Base.Indicator>
			</Base.Root>
			Enable notifications
		</label>
	)
}

export function Checkbox({
	label = "Buy groceries",
	initialChecked = true,
}: {
	label?: string
	initialChecked?: boolean
}) {
	const [checked, setChecked] = React.useState(initialChecked)
	const x = useSpring(0, { stiffness: 300, damping: 30 })

	React.useEffect(() => {
		const ids: number[] = []

		if (checked) {
			ids.push(
				globalThis.setTimeout(() => {
					x.set(-4)
				}, 400),
			)
			ids.push(
				globalThis.setTimeout(() => {
					x.set(0)
				}, 550),
			)
		} else {
			x.set(0)
		}

		return () => {
			ids.forEach(clearTimeout)
		}
	}, [checked])

	return (
		<div className="w-full h-full flex-center">
			<div className="flex items-center gap-3 transition-[background] ease-in-out duration-150 hover:bg-gray4 p-2 rounded-8 relative">
				<Base.Root className="checkbox" data-checked={checked}>
					<CheckIcon className="stroke-2" />
				</Base.Root>
				{/* <motion.div className="relative" style={{ x }}> */}
				<p className="text-16 text-gray12">{label}</p>
				{
					/* <motion.div
						animate={{ width: checked ? "100%" : 0 }}
						transition={{
							type: "spring",
							stiffness: 320,
							damping: 20,
							mass: 0.1,
							delay: checked ? 0.2 : 0,
						}}
						className="w-full h-[1px] bg-gray12 absolute translate-center-y"
					/>
				</motion.div> */
				}
				<input
					type="checkbox"
					checked={checked}
					onChange={(e) => setChecked(e.target.checked)}
					className="w-full h-full appearance-none absolute inset-0 rounded-8 cursor-pointer"
				/>
			</div>
		</div>
	)
}
