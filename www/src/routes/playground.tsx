import { createFileRoute } from "@tanstack/react-router"
import React from "react"
import { Dialog } from "@base-ui-components/react/dialog"
import { Input } from "@base-ui-components/react/input"

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
})

function RouteComponent() {
	const [open, setOpen] = React.useState(false)

	return (
		<div>
			Hello World

			<Dialog.Root open={open} onOpenChange={setOpen}>
				<Dialog.Trigger>Open</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Popup>
						<div
							className="fixed inset-0 bg-blue-100/50 overflow-y-auto"
							onClick={() => setOpen(false)}
						>
							<div className="relative top-4/5 w-full max-h-[90%] w-full h-full p-2">
								<div
									className="bg-blue-400 w-full h-full rounded-lg p-6 shadow-top"
									onClick={(e) => e.stopPropagation()}
								>¯
									<Dialog.Title>Example dialog</Dialog.Title>
									<Dialog.Close>Close</Dialog.Close>
									The gentle hum of the city faded as dusk settled over the
									skyline, casting long shadows across the quiet streets. In the
									soft glow of streetlights, people hurried home, their
									footsteps echoing on the pavement. Above, the first stars
									began to appear, promising a calm night ahead. The air was
									filled with the scent of blooming flowers from nearby gardens,
									mingling with the distant aroma of fresh bread from a local
									bakery. It was a moment of peaceful transition, where the
									bustle of the day gave way to the tranquility of evening.
									<Input />
								</div>
							</div>
						</div>
					</Dialog.Popup>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	)
}
