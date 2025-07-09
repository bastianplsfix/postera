export const queryKeys = {
	/* Todos */
	todos: () => ["todos"],
	getAllTodos: () => [...queryKeys.todos(), "list"],
	getTodos: (
		todoId: string | undefined,
	) => [...queryKeys.todos(), "one", { todoId }],
}
