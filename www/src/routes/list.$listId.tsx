import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  getAllTodosQueryOptions,
  getOneListQueryOptions,
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "~/integrations/query/todos.tsx";

export const Route = createFileRoute("/list/$listId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [editingTodo, setEditingTodo] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");

  const { data: list, isPending: listLoading, isError: listError } = useQuery(
    getOneListQueryOptions(listId),
  );
  const { data: todos, isPending: todosLoading, isError: todosError } =
    useQuery(
      getAllTodosQueryOptions(listId),
    );

  const createTodoMutation = useCreateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();
  const updateTodoMutation = useUpdateTodoMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      createTodoMutation.mutate({ title, description, listId });
      setTitle("");
      setDescription("");
    }
  };

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

  if (listLoading || todosLoading) return <div>Loading...</div>;
  if (listError || todosError) return <div>Error loading data</div>;
  if (!list) return <div>List not found</div>;

  const completedCount = todos?.filter((todo) => todo.completed).length || 0;
  const totalCount = todos?.length || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{list.name}</h1>
            <p className="text-gray-600">{list.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {completedCount} of {totalCount} completed
            </div>
            {totalCount > 0 && (
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      totalCount > 0 ? (completedCount / totalCount) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <Link to="/lists" className="text-blue-500 hover:text-blue-700">
            ← Back to Lists
          </Link>
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            All Todos
          </Link>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {todos?.map((todo) => {
          return (
            <div
              key={todo.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              {editingTodo === todo.id
                ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      className="border rounded px-3 py-2"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Todo title"
                    />
                    <textarea
                      className="border rounded px-3 py-2"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Todo description"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditSubmit(todo.id)}
                        disabled={!editTitle.trim() || !editDescription.trim()}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                      >
                        Save
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
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link
                        to="/$todoId"
                        params={{ todoId: todo.id }}
                        className="block hover:bg-gray-50 p-2 rounded -m-2"
                      >
                        <div
                          className={`${
                            todo.completed ? "line-through text-gray-500" : ""
                          }`}
                        >
                          <h3 className="font-bold text-lg">{todo.title}</h3>
                          <p className="text-gray-600">{todo.description}</p>
                        </div>
                      </Link>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleCompleteToggle(todo.id, todo.completed)}
                        className={`px-3 py-1 rounded text-white ${
                          todo.completed
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
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
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(todo.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
            </div>
          );
        })}

        {todos?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No todos in this list yet. Create your first todo below!
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Add New Todo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter todo description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            disabled={createTodoMutation.isPending || !title.trim() ||
              !description.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {createTodoMutation.isPending ? "Creating..." : "Add Todo"}
          </button>
        </form>
      </div>
    </div>
  );
}
