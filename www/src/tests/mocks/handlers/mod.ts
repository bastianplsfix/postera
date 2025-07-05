import { listHandlers } from "./lists.ts"
import { todoHandlers } from "./todos.ts"

export const handlers = [
	...listHandlers,
	...todoHandlers,
]
