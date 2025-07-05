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
    if (editTitle?.trim() && editDescription?.trim()) {
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
    <div>
      <div className="section">
        <div className="nav-links">
          <Link to="/">← Back to todos</Link>
        </div>
      </div>

      <div className="section">
        <div className="card">
          {isEditing
            ? (
              <div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
                <div className="button-group">
                  <button
                    type="button"
                    onClick={handleEditSubmit}
                    disabled={!editTitle?.trim() || !editDescription?.trim() ||
                      updateTodoMutation.isPending}
                  >
                    {updateTodoMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )
            : (
              <div>
                <div className="mb-4">
                  <h1 className={data.completed ? "completed" : ""}>
                    {data.title}
                  </h1>
                  <p
                    className={`text-gray-600 ${
                      data.completed ? "completed" : ""
                    }`}
                  >
                    {data.description}
                  </p>
                </div>

                <div className="flex gap-4 items-center mb-4">
                  <span>
                    Status: {data.completed ? "Completed" : "Pending"}
                  </span>
                  <span className="text-sm text-gray-500">
                    Created: {new Date(data.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    onClick={handleCompleteToggle}
                    disabled={updateTodoMutation.isPending}
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
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
