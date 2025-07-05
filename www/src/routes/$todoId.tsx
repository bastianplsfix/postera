import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  getOneTodoQueryOptions,
  useUpdateTodoMutation,
} from "~/integrations/query/todos.tsx";

export const Route = createFileRoute("/$todoId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { todoId } = Route.useParams();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");

  const { data, isPending, isError } = useQuery(
    getOneTodoQueryOptions(Number(todoId)),
  );
  const updateTodoMutation = useUpdateTodoMutation();

  const handleCompleteToggle = () => {
    if (data) {
      updateTodoMutation.mutate({
        todoId: data.id,
        updates: { completed: !data.completed },
      });
    }
  };

  const handleEditClick = () => {
    if (data) {
      setEditTitle(data.title);
      setEditDescription(data.description);
      setIsEditing(true);
    }
  };

  const handleEditSubmit = () => {
    if (editTitle.trim() && editDescription.trim()) {
      updateTodoMutation.mutate({
        todoId: todoId,
        updates: { title: editTitle, description: editDescription },
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditDescription("");
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading todo</div>;
  if (!data) return <div>Todo not found</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to todos
        </Link>
      </div>

      <div className="border rounded p-6 bg-white shadow">
        {isEditing
          ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  className="w-full border rounded p-2"
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  disabled={!editTitle.trim() || !editDescription.trim() ||
                    updateTodoMutation.isPending}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
                >
                  {updateTodoMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )
          : (
            <div className="flex flex-col gap-4">
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    data.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {data.title}
                </h1>
                <p
                  className={`text-gray-700 mt-2 ${
                    data.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {data.description}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    data.completed
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {data.completed ? "Completed" : "Pending"}
                </span>
                <span className="text-sm text-gray-500">
                  Created: {new Date(data.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCompleteToggle}
                  disabled={updateTodoMutation.isPending}
                  className={`px-4 py-2 rounded text-white ${
                    data.completed
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } disabled:bg-gray-300`}
                >
                  {updateTodoMutation.isPending
                    ? "Updating..."
                    : data.completed
                    ? "Mark as Pending"
                    : "Mark as Complete"}
                </button>
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
