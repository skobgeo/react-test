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
import styles from "./TodosPage.module.css";

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

    getTodos(page, filters)
      .then((response) => {
        setTodos((current) =>
          page === 1 ? response.items : [...current, ...response.items],
        );
        setTotal(response.total);
      })
      .catch((error: unknown) => {
        setServerError(
          error instanceof Error ? error.message : "Could not load todos",
        );
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    setTotal(0);
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || loading || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPage(page + 1);
      }
    });

    observer.observe(sentinel);
  }, [hasMore, loading]);

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

    try {
      const savedTodo = await createTodo(payload);
      setTodos([savedTodo, ...todos]);
      setTotal(total + 1);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Could not create todo",
      );
    }
  }

  const newestTitle = todos[0]?.title ?? "none";

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Todos</h1>
          <p>
            {todos.length} loaded · {activeCount} active · newest: {newestTitle}
          </p>
        </div>
      </header>

      <TodoFilters onChange={setFilters} value={filters} />
      <CreateTodoForm onCreate={handleCreate} />

      <TodoList items={todos} />

      <div className={styles.sentinel} ref={sentinelRef} />

      {loading && <p className={styles.loading}>Loading more...</p>}
    </section>
  );
}
