import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  getAllTodosQueryOptions,
  useCreateTodoMutation,
  useDeleteTodoMutation,
} from "~/integrations/query/todos.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { data, isPending, isError } = useQuery(
    getAllTodosQueryOptions(),
  );
  const createTodoMutation = useCreateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      createTodoMutation.mutate({ title, description });
      setTitle("");
      setDescription("");
    }
  };

  useEffect(() => {
    console.log("Hello");
  }, []);

  const handleDeleteClick = (todoId: string) => {
    const confirmDelete = globalThis.confirm(
      "Are you sure you want to delete this todo?",
    );

    if (confirmDelete) {
      deleteTodoMutation.mutate(todoId);
    }
  };

  if (isPending) return null;
  if (isError) return null;

  return (
    <>
      <div>
        {data.map((todo) => {
          return (
            <div key={todo.id} className="flex flex-col">
              <Link to="/$todoId" params={{ todoId: todo.id }}>
                <div>
                  {todo.title}
                </div>
              </Link>
              <button
                type="button"
                onClick={() => handleDeleteClick(todo.id)}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Create todo</p>
            <input
              type="text"
              className="border"
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              className="border"
              placeholder="Enter todo description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            disabled={createTodoMutation.isPending || !title.trim() ||
              !description.trim()}
          >
            {createTodoMutation.isPending ? "Creating..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}
