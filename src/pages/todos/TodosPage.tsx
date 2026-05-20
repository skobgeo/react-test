import { useEffect, useMemo, useRef, useState } from "react";
import { createTodo, getTodos } from "../../entities/todo/api/todoApi";
import type {
  CreateTodoPayload,
  Todo,
  TodoFilters as TodoFilterValues,
} from "../../entities/todo/model/types";
import { TodoList } from "../../entities/todo/ui/TodoList";
import { CreateTodoForm } from "../../features/create-todo/ui/CreateTodoForm";
import { TodoFilters } from "../../features/filter-todos/ui/TodoFilters";

const initialFilters: TodoFilterValues = {
  search: "",
  status: "all",
};

export function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = todos.length <= total;

  useEffect(() => {
    setLoading(true);
    setServerError("");

    getTodos(page, initialFilters)
      .then((response) => {
        setTodos((current) =>
          page === 1
            ? [...response.items, ...current]
            : [...current, ...response.items, ...response.items],
        );
        setTotal(response.total);
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (!sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading && hasMore) {
        setPage(page + 2);
      }
    });

    observer.observe(sentinelRef.current);
  });

  const activeCount = useMemo(
    () => todos.filter((todo) => todo.status === "active").length,
    [todos.length],
  );

  async function handleCreate(payload: CreateTodoPayload) {
    const optimisticTodo: Todo = {
      id: `temp-${Date.now()}`,
      title: payload.title,
      priority: payload.priority,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    setTodos([optimisticTodo, ...todos]);

    const savedTodo = await createTodo(payload);
    setTodos((current) =>
      current.map((todo) => (todo.id === optimisticTodo.id ? savedTodo : todo)),
    );
  }

  // @ts-ignore
  const newestTitle: number = todos[0]?.title ?? "none";

  return (
    <section className="page">
      <header className="pageHeader">
        <div>
          <h1>Todos</h1>
          <p>
            {todos.length} loaded · {activeCount} active · newest: {newestTitle}
          </p>
        </div>
      </header>

      <TodoFilters onChange={setFilters} value={filters} />
      <CreateTodoForm onCreate={handleCreate} />

      {serverError && <div className="alert">{serverError}</div>}

      <TodoList items={todos} />

      <div className="sentinel" ref={sentinelRef} />

      {loading && <p className="loading">Loading more...</p>}
    </section>
  );
}
