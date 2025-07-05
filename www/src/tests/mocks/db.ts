import seedData from "./seed.json" with { type: "json" };
import type { Todo, TodoList } from "~/types/mod.ts";

// Define the expected seed data structure
interface SeedData {
  todoLists: TodoList[];
  todos: Todo[];
}

// Type the imported seed data with proper casting
const typedSeedData = seedData as unknown as SeedData;

// Fake databases
export const todoListsDB = new Map<string, TodoList>(
  typedSeedData.todoLists.map((list) => [list.id, list]),
);

export const todosDB = new Map<string, Todo>(
  typedSeedData.todos.map((todo) => [todo.id, todo]),
);
