import { useState } from "react";
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
  // const [value, setValue] = useState(0);
  const { data, isPending, isError } = useQuery(
    getAllTodosQueryOptions(),
  );
  const createTodoMutation = useCreateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTodoMutation.mutate();
  };

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
              // value={value}
              // onChange={(e) => setValue(e.target.value)}
            />
          </label>
          <button type="submit" disabled={createTodoMutation.isPending}>
            {createTodoMutation.isPending ? "Creating..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}
