import type {
  CreateTodoPayload,
  Todo,
  TodoFilters,
  TodoListResponse,
} from "../model/types";

const baseUrl = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? "Request failed");
  }

  return response.json();
}

export async function getTodos(
  page: number,
  filters: TodoFilters,
): Promise<TodoListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    search: filters.search,
    status: filters.status,
  });

  return request<TodoListResponse>(`/todos?${params.toString()}`);
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
