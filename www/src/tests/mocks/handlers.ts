import { http, HttpResponse } from "msw";
import data from "./data.json" with { type: "json" };

export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

// Fake database - todos from JSON data
const todosDB = new Map((data as Todo[]).map((todo) => [todo.id, todo]));

export const handlers = [
  http.get("/todos", () => {
    return HttpResponse.json(Array.from(todosDB.values()));
  }),

  http.get("/todos/:id", ({ params }) => {
    const { id } = params;
    const todo = todosDB.get(id as string);

    if (!todo) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(todo);
  }),
];
