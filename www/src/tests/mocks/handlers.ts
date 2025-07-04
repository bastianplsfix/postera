import { http, HttpResponse } from "msw";

export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

// Fake database - todos map
const todosDB = new Map([
  ["1", {
    id: "1",
    title: "Learn TypeScript",
    description: "Study TypeScript fundamentals and advanced concepts",
    completed: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  }],
  ["2", {
    id: "2",
    title: "Build React App",
    description: "Create a todo application using React and TypeScript",
    completed: true,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
  }],
  ["3", {
    id: "3",
    title: "Write Tests",
    description: "Add comprehensive tests for the todo application",
    completed: false,
    createdAt: "2024-01-16T14:00:00Z",
    updatedAt: "2024-01-16T14:00:00Z",
  }],
  ["4", {
    id: "4",
    title: "Deploy to Production",
    description: "Set up CI/CD pipeline and deploy the application",
    completed: false,
    createdAt: "2024-01-17T11:00:00Z",
    updatedAt: "2024-01-17T11:00:00Z",
  }],
]);

export const handlers = [
  http.get("/todos", () => {
    return HttpResponse.json(Array.from(todosDB.values()));
  }),
];
