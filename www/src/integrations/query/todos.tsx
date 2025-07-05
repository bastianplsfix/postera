import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Todo } from "~/tests/mocks/handlers.ts";

export const queryKeys = {
  all: () => ["todos"],
  getAllTodos: () => [...queryKeys.all(), "list"],
  getTodos: (
    todoId: number | undefined,
  ) => [...queryKeys.all(), "one", { todoId }],
};

export const getAllTodosQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.getAllTodos(),
    queryFn: async (): Promise<Todo[]> => {
      const response = await fetch("/todos");
      if (!response.ok) throw new Error("Failed to fetch todos");
      return response.json();
    },
  });

export const getOneTodoQueryOptions = (todoId?: number) =>
  queryOptions({
    queryKey: queryKeys.getTodos(todoId),
    queryFn: async (): Promise<Todo> => {
      const response = await fetch(`/todos/${todoId}`);
      if (!response.ok) throw new Error("Failed to fetch todos");
      return response.json();
    },
  });

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<Todo> => {
      const todoData = {
        title: "Learn React Query",
        description: "Master mutations and queries in React Query",
        completed: false,
      };

      const response = await fetch("/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) throw new Error("Failed to create todo");
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: queryKeys.getAllTodos() });
    },
  });
};

export const useDeleteTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoId: string): Promise<void> => {
      const response = await fetch(`/todos/${todoId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete todo");
    },
    onSuccess: () => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: queryKeys.getAllTodos() });
    },
  });
};
