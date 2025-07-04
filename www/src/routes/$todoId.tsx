import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/$todoId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { todoId } = Route.useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ["todo", todoId],
    queryFn: async () => {
      const response = await fetch(`/todos/${todoId}`);
      if (!response.ok) throw new Error("Failed to fetch todo");
      return response.json();
    },
  });

  if (isPending) return null;
  if (isError) return null;

  return <div>{JSON.stringify(data, null, 2)}!</div>;
}
