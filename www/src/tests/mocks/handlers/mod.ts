import { http, HttpResponse } from "msw";
import type { Todo, TodoList } from "~/types/mod.ts";
import { todoListsDB, todosDB } from "../db.ts";

export const handlers = [
  // Todo Lists endpoints
  http.get("/lists", () => {
    return HttpResponse.json(Array.from(todoListsDB.values()));
  }),

  http.get("/lists/:id", ({ params }) => {
    const { id } = params;
    const list = todoListsDB.get(id as string);

    if (!list) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(list);
  }),

  http.post("/lists", async ({ request }) => {
    const listData = await request.json() as Omit<
      TodoList,
      "id" | "createdAt" | "updatedAt"
    >;

    const newId = String(
      Math.max(...Array.from(todoListsDB.keys()).map(Number)) + 1,
    );

    const newList: TodoList = {
      ...listData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todoListsDB.set(newId, newList);
    return HttpResponse.json(newList, { status: 201 });
  }),

  http.put("/lists/:id", async ({ params, request }) => {
    const { id } = params;
    const existingList = todoListsDB.get(id as string);

    if (!existingList) {
      return new HttpResponse(null, { status: 404 });
    }

    const updates = await request.json() as Partial<TodoList>;
    const updatedList: TodoList = {
      ...existingList,
      ...updates,
      id: existingList.id,
      updatedAt: new Date().toISOString(),
    };

    todoListsDB.set(id as string, updatedList);
    return HttpResponse.json(updatedList);
  }),

  http.delete("/lists/:id", ({ params }) => {
    const { id } = params;
    const list = todoListsDB.get(id as string);

    if (!list) {
      return new HttpResponse(null, { status: 404 });
    }

    // Delete all todos in this list
    const todosToDelete = Array.from(todosDB.values()).filter((todo) =>
      todo.listId === id
    );
    todosToDelete.forEach((todo) => todosDB.delete(todo.id));

    todoListsDB.delete(id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  // Todos endpoints
  http.get("/todos", ({ request }) => {
    const url = new URL(request.url);
    const listId = url.searchParams.get("listId");

    let todos = Array.from(todosDB.values());

    if (listId) {
      todos = todos.filter((todo) => todo.listId === listId);
    }

    return HttpResponse.json(todos);
  }),

  http.get("/todos/:id", ({ params }) => {
    const { id } = params;
    const todo = todosDB.get(id as string);

    if (!todo) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(todo);
  }),

  http.post("/todos", async ({ request }) => {
    const todoData = await request.json() as Omit<
      Todo,
      "id" | "createdAt" | "updatedAt"
    >;

    // Validate that the listId exists
    if (!todoListsDB.has(todoData.listId)) {
      return new HttpResponse(JSON.stringify({ error: "List not found" }), {
        status: 400,
      });
    }

    // Generate a new ID (simple incrementing ID for demo)
    const newId = String(
      Math.max(...Array.from(todosDB.keys()).map(Number)) + 1,
    );

    const newTodo: Todo = {
      ...todoData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todosDB.set(newId, newTodo);
    return HttpResponse.json(newTodo, { status: 201 });
  }),

  http.put("/todos/:id", async ({ params, request }) => {
    const { id } = params;
    const existingTodo = todosDB.get(id as string);

    if (!existingTodo) {
      return new HttpResponse(null, { status: 404 });
    }

    const updates = await request.json() as Partial<Todo>;
    const updatedTodo: Todo = {
      ...existingTodo,
      ...updates,
      id: existingTodo.id, // Ensure id cannot be changed
      updatedAt: new Date().toISOString(),
    };

    todosDB.set(id as string, updatedTodo);
    return HttpResponse.json(updatedTodo);
  }),

  http.delete("/todos/:id", ({ params }) => {
    const { id } = params;
    const todo = todosDB.get(id as string);

    if (!todo) {
      return new HttpResponse(null, { status: 404 });
    }

    todosDB.delete(id as string);
    return new HttpResponse(null, { status: 204 });
  }),
];
