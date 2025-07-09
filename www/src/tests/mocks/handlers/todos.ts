import { http, HttpResponse } from "msw"
import type { Todo } from "~/types/mod.ts"
import { todosDB } from "../db.ts"

export const todoHandlers = [
	// Todos endpoints
	http.get("/todos", () => {
		const todos = Array.from(todosDB.values())
		return HttpResponse.json(todos)
	}),

	http.get("/todos/:id", ({ params }) => {
		const { id } = params
		const todo = todosDB.get(id as string)

		if (!todo) {
			return new HttpResponse(null, { status: 404 })
		}

		return HttpResponse.json(todo)
	}),

	http.post("/todos", async ({ request }) => {
		const todoData = await request.json() as Omit<
			Todo,
			"id" | "createdAt" | "updatedAt"
		>

		// Generate a new ID (simple incrementing ID for demo)
		const newId = String(
			Math.max(...Array.from(todosDB.keys()).map(Number)) + 1,
		)

		const newTodo: Todo = {
			...todoData,
			id: newId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		todosDB.set(newId, newTodo)
		return HttpResponse.json(newTodo, { status: 201 })
	}),

	http.put("/todos/:id", async ({ params, request }) => {
		const { id } = params
		const existingTodo = todosDB.get(id as string)

		if (!existingTodo) {
			return new HttpResponse(null, { status: 404 })
		}

		const updates = await request.json() as Partial<Todo>
		const updatedTodo: Todo = {
			...existingTodo,
			...updates,
			id: existingTodo.id, // Ensure id cannot be changed
			updatedAt: new Date().toISOString(),
		}

		todosDB.set(id as string, updatedTodo)
		return HttpResponse.json(updatedTodo)
	}),

	http.delete("/todos/:id", ({ params }) => {
		const { id } = params
		const todo = todosDB.get(id as string)

		if (!todo) {
			return new HttpResponse(null, { status: 404 })
		}

		todosDB.delete(id as string)
		return new HttpResponse(null, { status: 204 })
	}),
]
