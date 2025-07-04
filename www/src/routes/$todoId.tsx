import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getOneTodoQueryOptions } from "~/integrations/query/todos.tsx";

export const Route = createFileRoute("/$todoId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { todoId } = Route.useParams();

  const { data, isPending, isError } = useQuery(getOneTodoQueryOptions(todoId));

  if (isPending) return null;
  if (isError) return null;

  return <div>{JSON.stringify(data, null, 2)}!</div>;
}
