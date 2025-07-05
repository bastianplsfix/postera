import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  getAllTodosQueryOptions,
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "~/integrations/query/todos.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [editingTodo, setEditingTodo] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");
  const { data, isPending, isError } = useQuery(
    getAllTodosQueryOptions(),
  );
  const createTodoMutation = useCreateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();
  const updateTodoMutation = useUpdateTodoMutation();

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

  const handleCompleteToggle = (todoId: string, completed: boolean) => {
    updateTodoMutation.mutate({
      todoId,
      updates: { completed: !completed },
    });
  };

  const handleEditClick = (
    todoId: string,
    currentTitle: string,
    currentDescription: string,
  ) => {
    setEditingTodo(todoId);
    setEditTitle(currentTitle);
    setEditDescription(currentDescription);
  };

  const handleEditSubmit = (todoId: string) => {
    if (editTitle.trim() && editDescription.trim()) {
      updateTodoMutation.mutate({
        todoId,
        updates: { title: editTitle, description: editDescription },
      });
      setEditingTodo(null);
      setEditTitle("");
      setEditDescription("");
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditTitle("");
    setEditDescription("");
  };

  if (isPending) return null;
  if (isError) return null;

  return (
    <>
      <div>
        {data.map((todo) => {
          return (
            <div key={todo.id} className="flex flex-col border p-4 mb-2">
              {editingTodo === todo.id
                ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      className="border p-2"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      className="border p-2"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditSubmit(todo.id)}
                        disabled={!editTitle.trim() || !editDescription.trim()}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )
                : (
                  <div className="flex flex-col gap-2">
                    <Link to="/$todoId" params={{ todoId: todo.id }}>
                      <div
                        className={`${
                          todo.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        <h3 className="font-bold">{todo.title}</h3>
                        <p>{todo.description}</p>
                      </div>
                    </Link>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleCompleteToggle(todo.id, todo.completed)}
                        className={`px-2 py-1 rounded ${
                          todo.completed
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {todo.completed ? "Undo" : "Complete"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(
                            todo.id,
                            todo.title,
                            todo.description,
                          )}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(todo.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
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
