import seedData from "./seed.json" with { type: "json" }
import type { Todo } from "~/types/mod.ts"

// Define the expected seed data structure
interface SeedData {
	todos: Todo[]
}

// Type the imported seed data with proper casting
const typedSeedData = seedData as unknown as SeedData

// Fake database
export const todosDB = new Map<string, Todo>(
	typedSeedData.todos.map((todo) => [todo.id, todo]),
)
