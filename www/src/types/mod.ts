export type TodoList = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  listId: string;
  createdAt: string;
  updatedAt: string;
};
