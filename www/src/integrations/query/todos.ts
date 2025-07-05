import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query"
import type { Todo } from "~/types/mod.ts"
import { queryKeys } from "./query-keys.ts"

export const getAllTodosQueryOptions = (listId?: string) =>
	queryOptions({
		queryKey: queryKeys.getAllTodos(listId),
		queryFn: async (): Promise<Todo[]> => {
			const url = listId ? `/todos?listId=${listId}` : "/todos"
			const response = await fetch(url)
			if (!response.ok) throw new Error("Failed to fetch todos")
			return response.json()
		},
	})

export const getOneTodoQueryOptions = (todoId?: string) =>
	queryOptions({
		queryKey: queryKeys.getTodos(todoId),
		queryFn: async (): Promise<Todo> => {
			const response = await fetch(`/todos/${todoId}`)
			if (!response.ok) throw new Error("Failed to fetch todos")
			return response.json()
		},
	})

export const useCreateTodoMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (
			todoData: { title: string; description: string; listId: string },
		): Promise<Todo> => {
			const requestData = {
				...todoData,
				completed: false,
			}

			const response = await fetch("/todos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestData),
			})

			if (!response.ok) throw new Error("Failed to create todo")
			return response.json()
		},
		onSuccess: (newTodo) => {
			// Invalidate and refetch todos list for the specific list
			queryClient.invalidateQueries({
				queryKey: queryKeys.getAllTodos(newTodo.listId),
			})
			queryClient.invalidateQueries({ queryKey: queryKeys.getAllTodos() })
		},
	})
}

export const useUpdateTodoMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (
			{ todoId, updates }: { todoId: string; updates: Partial<Todo> },
		): Promise<Todo> => {
			const response = await fetch(`/todos/${todoId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updates),
			})

			if (!response.ok) throw new Error("Failed to update todo")
			return response.json()
		},
		onSuccess: (updatedTodo) => {
			// Invalidate and refetch todos list
			queryClient.invalidateQueries({
				queryKey: queryKeys.getAllTodos(updatedTodo.listId),
			})
			queryClient.invalidateQueries({ queryKey: queryKeys.getAllTodos() })
		},
	})
}

export const useDeleteTodoMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (todoId: string): Promise<void> => {
			const response = await fetch(`/todos/${todoId}`, {
				method: "DELETE",
			})

			if (!response.ok) throw new Error("Failed to delete todo")
		},
		onSuccess: () => {
			// Invalidate and refetch todos list
			queryClient.invalidateQueries({ queryKey: queryKeys.getAllTodos() })
		},
	})
}
