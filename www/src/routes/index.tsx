import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Todo } from "~/tests/mocks/handlers.ts";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending, isError } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () =>
      fetch("/todos", { method: "GET" }).then((data) => data.json()),
  });

  if (isPending) return null;
  if (isError) return null;

  return (
    <div>
      {data.map((todo) => {
        return <div key={todo.id}>{todo.title}</div>;
      })}
    </div>
  );
}
