import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Link } from "@tanstack/react-router";
import { getAllTodosQueryOptions } from "~/integrations/query/todos.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending, isError } = useQuery(
    getAllTodosQueryOptions(),
  );

  if (isPending) return null;
  if (isError) return null;

  return (
    <div>
      {data.map((todo) => {
        return (
          <Link to="/$todoId" params={{ todoId: todo.id }}>
            <div key={todo.id}>{todo.title}</div>
          </Link>
        );
      })}
    </div>
  );
}
