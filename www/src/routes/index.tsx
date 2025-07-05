import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import {
  getAllListsQueryOptions,
  getAllTodosQueryOptions,
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "~/integrations/query/todos.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [quickAddTitle, setQuickAddTitle] = React.useState("");
  const [quickAddDescription, setQuickAddDescription] = React.useState("");
  const [listInputs, setListInputs] = React.useState<
    Record<string, { title: string; description: string }>
  >({});
  const [editingTodo, setEditingTodo] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");

  const { data: todos, isPending, isError } = useQuery(
    getAllTodosQueryOptions(),
  );
  const { data: lists } = useQuery(getAllListsQueryOptions());
  const createTodoMutation = useCreateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();
  const updateTodoMutation = useUpdateTodoMutation();

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      quickAddTitle.trim() && quickAddDescription.trim() && lists &&
      lists.length > 0
    ) {
      // Create in first list by default
      createTodoMutation.mutate({
        title: quickAddTitle,
        description: quickAddDescription,
        listId: lists[0].id,
      });
      setQuickAddTitle("");
      setQuickAddDescription("");
    }
  };

  const handleListAddSubmit = (e: React.FormEvent, listId: string) => {
    e.preventDefault();
    const listInput = listInputs[listId];
    if (listInput && listInput.title.trim() && listInput.description.trim()) {
      createTodoMutation.mutate({
        title: listInput.title,
        description: listInput.description,
        listId,
      });
      setListInputs((prev) => ({
        ...prev,
        [listId]: { title: "", description: "" },
      }));
    }
  };

  const updateListInput = (
    listId: string,
    field: "title" | "description",
    value: string,
  ) => {
    setListInputs((prev) => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        [field]: value,
      },
    }));
  };

  const getListInput = (listId: string) => {
    return listInputs[listId] || { title: "", description: "" };
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

  const getTodosByList = (listId: string) => {
    return todos?.filter((todo) => todo.listId === listId) || [];
  };

  const getListStats = (listId: string) => {
    const listTodos = getTodosByList(listId);
    const completed = listTodos.filter((todo) => todo.completed).length;
    const total = listTodos.length;
    return { completed, total };
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Todos</h1>
        <div className="flex gap-4">
          <a
            href="/lists"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Manage Lists
          </a>
        </div>
      </div>

      {/* Quick Add Section */}
      {lists && lists.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Add Todo</h2>
          <p className="text-sm text-gray-600 mb-4">
            This will be added to "{lists[0].name}" list. For more control, use
            the individual list sections below.
          </p>
          <form onSubmit={handleQuickAddSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="quickAddTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="quickAddTitle"
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter todo title"
                value={quickAddTitle}
                onChange={(e) => setQuickAddTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="quickAddDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="quickAddDescription"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter todo description"
                value={quickAddDescription}
                onChange={(e) => setQuickAddDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              disabled={createTodoMutation.isPending || !quickAddTitle.trim() ||
                !quickAddDescription.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {createTodoMutation.isPending ? "Creating..." : "Quick Add Todo"}
            </button>
          </form>
        </div>
      )}

      {/* Lists and Todos Sections */}
      <div className="space-y-8">
        {lists?.map((list) => {
          const listTodos = getTodosByList(list.id);
          const stats = getListStats(list.id);
          const listInput = getListInput(list.id);

          return (
            <div
              key={list.id}
              className="border rounded-lg p-6 shadow-sm bg-white"
            >
              {/* List Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <a
                    href={`/list/${list.id}`}
                    className="hover:text-blue-600"
                  >
                    <h2 className="text-2xl font-bold text-gray-800">
                      {list.name}
                    </h2>
                  </a>
                  <p className="text-gray-600 mt-1">{list.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">
                      {stats.total} todo{stats.total !== 1 ? "s" : ""}
                      {stats.total > 0 && (
                        <span>• {stats.completed} completed</span>
                      )}
                    </span>
                    {stats.total > 0 && (
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              stats.total > 0
                                ? (stats.completed / stats.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <a
                  href={`/list/${list.id}`}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  View List →
                </a>
              </div>

              {/* Todos */}
              <div className="space-y-3 mb-6">
                {listTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="border rounded-lg p-4 shadow-sm bg-gray-50"
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
                              disabled={!editTitle.trim() ||
                                !editDescription.trim()}
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
                            <a
                              href={`/${todo.id}`}
                              className="block hover:bg-gray-100 p-2 rounded -m-2"
                            >
                              <div
                                className={`${
                                  todo.completed
                                    ? "line-through text-gray-500"
                                    : ""
                                }`}
                              >
                                <h3 className="font-bold text-lg">
                                  {todo.title}
                                </h3>
                                <p className="text-gray-600">
                                  {todo.description}
                                </p>
                              </div>
                            </a>
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
                ))}

                {listTodos.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No todos in this list yet. Add your first todo below!
                  </div>
                )}
              </div>

              {/* Add Todo Form for this List */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Add Todo to {list.name}
                </h3>
                <form
                  onSubmit={(e) => handleListAddSubmit(e, list.id)}
                  className="space-y-3"
                >
                  <div>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter todo title"
                      value={listInput.title}
                      onChange={(e) =>
                        updateListInput(list.id, "title", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter todo description"
                      value={listInput.description}
                      onChange={(e) =>
                        updateListInput(list.id, "description", e.target.value)}
                      rows={2}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createTodoMutation.isPending ||
                      !listInput.title.trim() || !listInput.description.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {createTodoMutation.isPending ? "Adding..." : "Add Todo"}
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>

      {(!lists || lists.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-4">No lists yet!</p>
          <p className="mb-6">
            Create your first list to start organizing your todos.
          </p>
          <a
            href="/lists"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Create Your First List
          </a>
        </div>
      )}
    </div>
  );
}
