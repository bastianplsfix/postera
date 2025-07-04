import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getAllTodosQueryOptions } from "~/integrations/query/todos.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [value, setValue] = useState("");
  const { data, isPending, isError } = useQuery(
    getAllTodosQueryOptions(),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted");
  };

  if (isPending) return null;
  if (isError) return null;

  return (
    <>
      <div>
        {data.map((todo) => {
          return (
            <Link to="/$todoId" params={{ todoId: todo.id }}>
              <div key={todo.id}>{todo.title}</div>
            </Link>
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
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
