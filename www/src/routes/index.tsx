import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Todo } from "~/tests/mocks/handlers.ts";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending, isError } = useQuery<Todo[]>({
    queryKey: ["todos", "list"],
    queryFn: () =>
      fetch("/todos", { method: "GET" }).then((data) => data.json()),
  });

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
