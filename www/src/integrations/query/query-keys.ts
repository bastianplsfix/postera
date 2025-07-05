export const queryKeys = {
	/* Todos */
	todos: () => ["todos"],
	getAllTodos: (listId?: string) => [...queryKeys.todos(), "list", { listId }],
	getTodos: (
		todoId: string | undefined,
	) => [...queryKeys.todos(), "one", { todoId }],
	/* Lists */
	lists: () => ["lists"],
	getAllLists: () => [...queryKeys.lists(), "list"],
	getList: (
		listId: string | undefined,
	) => [...queryKeys.lists(), "one", { listId }],
}
