import { queryOptions } from "@tanstack/react-query";
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
