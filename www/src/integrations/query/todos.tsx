import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Todo, TodoList } from "~/tests/mocks/handlers.ts";

export const queryKeys = {
  all: () => ["todos"],
  getAllTodos: (listId?: string) => [...queryKeys.all(), "list", { listId }],
  getTodos: (
    todoId: string | undefined,
  ) => [...queryKeys.all(), "one", { todoId }],
  lists: () => ["lists"],
  getAllLists: () => [...queryKeys.lists(), "list"],
  getList: (
    listId: string | undefined,
  ) => [...queryKeys.lists(), "one", { listId }],
};

export const getAllTodosQueryOptions = (listId?: string) =>
  queryOptions({
    queryKey: queryKeys.getAllTodos(listId),
    queryFn: async (): Promise<Todo[]> => {
      const url = listId ? `/todos?listId=${listId}` : "/todos";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch todos");
      return response.json();
    },
  });

export const getOneTodoQueryOptions = (todoId?: string) =>
  queryOptions({
    queryKey: queryKeys.getTodos(todoId),
    queryFn: async (): Promise<Todo> => {
      const response = await fetch(`/todos/${todoId}`);
      if (!response.ok) throw new Error("Failed to fetch todos");
      return response.json();
    },
  });

export const getAllListsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.getAllLists(),
    queryFn: async (): Promise<TodoList[]> => {
      const response = await fetch("/lists");
      if (!response.ok) throw new Error("Failed to fetch lists");
      return response.json();
    },
  });

export const getOneListQueryOptions = (listId?: string) =>
  queryOptions({
    queryKey: queryKeys.getList(listId),
    queryFn: async (): Promise<TodoList> => {
      const response = await fetch(`/lists/${listId}`);
      if (!response.ok) throw new Error("Failed to fetch list");
      return response.json();
    },
  });

export const useCreateTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      todoData: { title: string; description: string; listId: string },
    ): Promise<Todo> => {
      const requestData = {
        ...todoData,
        completed: false,
      };

      const response = await fetch("/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Failed to create todo");
      return response.json();
    },
    onSuccess: (newTodo) => {
      // Invalidate and refetch todos list for the specific list
      queryClient.invalidateQueries({
        queryKey: queryKeys.getAllTodos(newTodo.listId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.getAllTodos() });
    },
  });
};

export const useCreateListMutation = () => {
  const queryClient = useQueryClient();

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
      });

      if (!response.ok) throw new Error("Failed to create list");
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch lists
      queryClient.invalidateQueries({ queryKey: queryKeys.getAllLists() });
    },
  });
};

export const useUpdateListMutation = () => {
  const queryClient = useQueryClient();

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
      });

      if (!response.ok) throw new Error("Failed to update list");
      return response.json();
    },
    onSuccess: (updatedList) => {
      // Invalidate and refetch lists
      queryClient.invalidateQueries({ queryKey: queryKeys.getAllLists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getList(updatedList.id),
      });
    },
  });
};

export const useDeleteListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listId: string): Promise<void> => {
      const response = await fetch(`/lists/${listId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete list");
    },
    onSuccess: () => {
      // Invalidate and refetch lists and todos
      queryClient.invalidateQueries({ queryKey: queryKeys.getAllLists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.getAllTodos() });
    },
  });
};

export const useUpdateTodoMutation = () => {
  const queryClient = useQueryClient();

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
      });

      if (!response.ok) throw new Error("Failed to update todo");
      return response.json();
    },
    onSuccess: (updatedTodo) => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({
        queryKey: queryKeys.getAllTodos(updatedTodo.listId),
      });
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
