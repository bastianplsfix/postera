import { createFileRoute } from "@tanstack/react-router"
import React from "react"
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog"

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
})

function RouteComponent() {
	const [open, setOpen] = React.useState(false)
	return (
		<div>
			<div onClick={() => setOpen(true)}>
				Hello world
				<button type="button">
					Open
				</button>
			</div>
			<dialog
				open={open}
			>
				<div className="fixed inset-0 bg-blue-100/50 overflow-y-auto">
					<div className="relative top-4/5 w-full max-h-[90%] w-full h-full p-2">
						<div className="bg-blue-400 w-full h-full rounded-lg p-6 shadow-top">
							The gentle hum of the city faded as dusk settled over the skyline,
							casting long shadows across the quiet streets. In the soft glow of
							streetlights, people hurried home, their footsteps echoing on the
							pavement. Above, the first stars began to appear, promising a calm
							night ahead. The air was filled with the scent of blooming flowers
							from nearby gardens, mingling with the distant aroma of fresh
							bread from a local bakery. It was a moment of peaceful transition,
							where the bustle of the day gave way to the tranquility of
							evening.
						</div>
					</div>
				</div>
			</dialog>
		</div>
	)
}
