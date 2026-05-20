export type TodoStatus = "active" | "done";
export type TodoPriority = "low" | "normal" | "high";

export type Todo = {
  id: string;
  title: string;
  status: TodoStatus;
  priority: TodoPriority;
  createdAt: string;
};

export type TodoFilters = {
  search: string;
  status: "all" | TodoStatus;
};

export type TodoListResponse = {
  items: Todo[];
  page: number;
  pageSize: number;
  total: number;
};

export type CreateTodoPayload = {
  title: string;
  priority: TodoPriority;
};
