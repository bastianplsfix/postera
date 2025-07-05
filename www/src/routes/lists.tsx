import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  getAllListsQueryOptions,
  getAllTodosQueryOptions,
  useCreateListMutation,
  useDeleteListMutation,
  useUpdateListMutation,
} from "~/integrations/query/todos.tsx";

export const Route = createFileRoute("/lists")({
  component: RouteComponent,
});

function RouteComponent() {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [editingList, setEditingList] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");

  const { data: lists, isPending: listsLoading, isError: listsError } =
    useQuery(
      getAllListsQueryOptions(),
    );
  const { data: allTodos } = useQuery(getAllTodosQueryOptions());

  const createListMutation = useCreateListMutation();
  const deleteListMutation = useDeleteListMutation();
  const updateListMutation = useUpdateListMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      createListMutation.mutate({ name, description });
      setName("");
      setDescription("");
    }
  };

  const handleDeleteClick = (listId: string) => {
    const todosInList =
      allTodos?.filter((todo) => todo.listId === listId).length || 0;
    const confirmMessage = todosInList > 0
      ? `Are you sure you want to delete this list? It contains ${todosInList} todo(s) that will also be deleted.`
      : "Are you sure you want to delete this list?";

    const confirmDelete = globalThis.confirm(confirmMessage);

    if (confirmDelete) {
      deleteListMutation.mutate(listId);
    }
  };

  const handleEditClick = (
    listId: string,
    currentName: string,
    currentDescription: string,
  ) => {
    setEditingList(listId);
    setEditName(currentName);
    setEditDescription(currentDescription);
  };

  const handleEditSubmit = (listId: string) => {
    if (editName.trim() && editDescription.trim()) {
      updateListMutation.mutate({
        listId,
        updates: { name: editName, description: editDescription },
      });
      setEditingList(null);
      setEditName("");
      setEditDescription("");
    }
  };

  const handleCancelEdit = () => {
    setEditingList(null);
    setEditName("");
    setEditDescription("");
  };

  const getTodoCount = (listId: string) => {
    return allTodos?.filter((todo) => todo.listId === listId).length || 0;
  };

  const getCompletedCount = (listId: string) => {
    return allTodos?.filter((todo) => todo.listId === listId && todo.completed)
      .length || 0;
  };

  if (listsLoading) return <div>Loading lists...</div>;
  if (listsError) return <div>Error loading lists</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Todo Lists</h1>
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          ← Back to Todos
        </Link>
      </div>

      <div className="grid gap-4 mb-8">
        {lists?.map((list) => {
          const todoCount = getTodoCount(list.id);
          const completedCount = getCompletedCount(list.id);

          return (
            <div key={list.id} className="border rounded-lg p-4 shadow-sm">
              {editingList === list.id
                ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      className="border rounded px-3 py-2"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="List name"
                    />
                    <textarea
                      className="border rounded px-3 py-2"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="List description"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditSubmit(list.id)}
                        disabled={!editName.trim() || !editDescription.trim()}
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
                        to="/list/$listId"
                        params={{ listId: list.id }}
                        className="block hover:bg-gray-50 p-2 rounded -m-2"
                      >
                        <h3 className="font-bold text-lg">{list.name}</h3>
                        <p className="text-gray-600 mb-2">{list.description}</p>
                        <div className="text-sm text-gray-500">
                          {todoCount} todo{todoCount !== 1 ? "s" : ""}
                          {todoCount > 0 && (
                            <span>• {completedCount} completed</span>
                          )}
                        </div>
                      </Link>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(list.id, list.name, list.description)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(list.id)}
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
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Create New List</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              List Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter list name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="Enter list description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            disabled={createListMutation.isPending || !name.trim() ||
              !description.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {createListMutation.isPending ? "Creating..." : "Create List"}
          </button>
        </form>
      </div>
    </div>
  );
}
