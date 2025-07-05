import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query"
import type { TodoList } from "~/types/mod.ts"
import { queryKeys } from "./query-keys.ts"

export const getAllListsQueryOptions = () =>
	queryOptions({
		queryKey: queryKeys.getAllLists(),
		queryFn: async (): Promise<TodoList[]> => {
			const response = await fetch("/lists")
			if (!response.ok) throw new Error("Failed to fetch lists")
			return response.json()
		},
	})

export const getOneListQueryOptions = (listId?: string) =>
	queryOptions({
		queryKey: queryKeys.getList(listId),
		queryFn: async (): Promise<TodoList> => {
			const response = await fetch(`/lists/${listId}`)
			if (!response.ok) throw new Error("Failed to fetch list")
			return response.json()
		},
	})

export const useCreateListMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (
			listData: { name: string; description: string },
		): Promise<TodoList> => {
			const response = await fetch("/lists", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(listData),
			})

			if (!response.ok) throw new Error("Failed to create list")
			return response.json()
		},
		onSuccess: () => {
			// Invalidate and refetch lists
			queryClient.invalidateQueries({ queryKey: queryKeys.getAllLists() })
		},
	})
}

export const useUpdateListMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (
			{ listId, updates }: { listId: string; updates: Partial<TodoList> },
		): Promise<TodoList> => {
			const response = await fetch(`/lists/${listId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updates),
			})

			if (!response.ok) throw new Error("Failed to update list")
			return response.json()
		},
		onSuccess: (updatedList) => {
			// Invalidate and refetch lists
			queryClient.invalidateQueries({ queryKey: queryKeys.getAllLists() })
			queryClient.invalidateQueries({
				queryKey: queryKeys.getList(updatedList.id),
			})
		},
	})
}

export const useDeleteListMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (listId: string): Promise<void> => {
			const response = await fetch(`/lists/${listId}`, {
				method: "DELETE",
			})

			if (!response.ok) throw new Error("Failed to delete list")
		},
		onSuccess: () => {
			// Invalidate and refetch lists and todos
			queryClient.invalidateQueries({ queryKey: queryKeys.getAllLists() })
			queryClient.invalidateQueries({ queryKey: queryKeys.getAllTodos() })
		},
	})
}
