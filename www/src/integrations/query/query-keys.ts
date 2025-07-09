export const queryKeys = {
	/* Todos */
	todos: () => ["todos"],
	getAllTodos: () => [...queryKeys.todos(), "all"],
	getTodos: (
		todoId: string | undefined,
	) => [...queryKeys.todos(), "one", { todoId }],
}
