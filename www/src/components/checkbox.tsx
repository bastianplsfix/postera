import { CheckIcon } from "~/assets/icons.tsx"
import { Checkbox as Base } from "@base-ui-components/react/checkbox"

export function Checkbox() {
	return (
		<label className="flex items-center gap-2 text-base text-gray-900">
			<Base.Root
				defaultChecked
				className="flex size-5 items-center justify-center rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-[checked]:bg-gray-900 data-[unchecked]:border data-[unchecked]:border-gray-300"
			>
				<Base.Indicator className="flex text-gray-50 data-[unchecked]:hidden">
					<CheckIcon className="fill-white" />
				</Base.Indicator>
			</Base.Root>
			Enable notifications
		</label>
	)
}
