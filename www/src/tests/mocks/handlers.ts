import { http, HttpResponse } from "msw";
import seed from "./seed.json" with { type: "json" };

export type TodoList = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  listId: string;
  createdAt: string;
  updatedAt: string;
};

// Fake databases
const todoListsDB = new Map<string, TodoList>([
  ["1", {
    id: "1",
    name: "Personal",
    description: "Personal tasks and goals",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  }],
  ["2", {
    id: "2",
    name: "Work",
    description: "Work-related tasks",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  }],
]);

const todosDB = new Map((seed as Todo[]).map((todo) => [todo.id, todo]));

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
