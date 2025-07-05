import { http, HttpResponse } from "msw"
import type { TodoList } from "~/types/mod.ts"
import { todoListsDB, todosDB } from "../db.ts"

export const listHandlers = [
	// Todo Lists endpoints
	http.get("/lists", () => {
		return HttpResponse.json(Array.from(todoListsDB.values()))
	}),

	http.get("/lists/:id", ({ params }) => {
		const { id } = params
		const list = todoListsDB.get(id as string)

		if (!list) {
			return new HttpResponse(null, { status: 404 })
		}

		return HttpResponse.json(list)
	}),

	http.post("/lists", async ({ request }) => {
		const listData = await request.json() as Omit<
			TodoList,
			"id" | "createdAt" | "updatedAt"
		>

		const newId = String(
			Math.max(...Array.from(todoListsDB.keys()).map(Number)) + 1,
		)

		const newList: TodoList = {
			...listData,
			id: newId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		todoListsDB.set(newId, newList)
		return HttpResponse.json(newList, { status: 201 })
	}),

	http.put("/lists/:id", async ({ params, request }) => {
		const { id } = params
		const existingList = todoListsDB.get(id as string)

		if (!existingList) {
			return new HttpResponse(null, { status: 404 })
		}

		const updates = await request.json() as Partial<TodoList>
		const updatedList: TodoList = {
			...existingList,
			...updates,
			id: existingList.id,
			updatedAt: new Date().toISOString(),
		}

		todoListsDB.set(id as string, updatedList)
		return HttpResponse.json(updatedList)
	}),

	http.delete("/lists/:id", ({ params }) => {
		const { id } = params
		const list = todoListsDB.get(id as string)

		if (!list) {
			return new HttpResponse(null, { status: 404 })
		}

		// Delete all todos in this list
		const todosToDelete = Array.from(todosDB.values()).filter((todo) =>
			todo.listId === id
		)
		todosToDelete.forEach((todo) => todosDB.delete(todo.id))

		todoListsDB.delete(id as string)
		return new HttpResponse(null, { status: 204 })
	}),
]
