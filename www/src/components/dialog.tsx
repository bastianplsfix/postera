import { Dialog as BaseDialog } from "@base-ui-components/react/dialog"

export function Dialog() {
	return (
		<BaseDialog.Root>
			<BaseDialog.Trigger className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
				View notifications
			</BaseDialog.Trigger>
			<BaseDialog.Portal>
				<div className="fixed inset-0 overflow-y-auto m-4">
					<BaseDialog.Backdrop className="fixed inset-0 bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:opacity-70" />
					<BaseDialog.Popup className="relative top-4/5 w-full h-[90%] rounded-lg bg-gray-50 p-6 text-gray-900 outline outline-1 outline-gray-200 transition-all duration-150 data-[ending-style]:translate-y-4 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-4 data-[starting-style]:opacity-0 dark:outline-gray-300">
						<BaseDialog.Title className="-mt-1.5 mb-1 text-lg font-medium">
							Notifications
						</BaseDialog.Title>
						<BaseDialog.Description className="mb-6 text-base text-gray-600">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
							euismod, urna eu tincidunt consectetur, nisi nisl aliquam enim, eu
							laoreet erat orci nec dolor. Quisque ac dictum enim. Vivamus
							luctus, magna et commodo posuere, tortor risus facilisis lectus, a
							porttitor nisi lacus eget elit. Pellentesque habitant morbi
							tristique senectus et netus et malesuada fames ac turpis egestas.
							Maecenas vel ipsum at velit tincidunt facilisis. Etiam eget orci
							quis nisi dictum gravida. Suspendisse potenti.
						</BaseDialog.Description>
						<div className="flex justify-end gap-4">
							<BaseDialog.Close className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
								Close
							</BaseDialog.Close>
						</div>
					</BaseDialog.Popup>
				</div>
			</BaseDialog.Portal>
		</BaseDialog.Root>
	)
}
