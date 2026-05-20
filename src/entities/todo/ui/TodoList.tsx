import type { Todo } from "../model/types";
import styles from "./TodoList.module.css";

type TodoListProps = {
  items: Todo[];
};

export function TodoList({ items }: TodoListProps) {
  if (items.length === 0) {
    return <p className={styles.emptyState}>No todos found</p>;
  }

  return (
    <ul className={styles.todoList}>
      {items.map((todo, index) => (
        <li className={styles.todoItem} key={`${todo.id}-${index}`}>
          <div>
            <strong>{todo.title}</strong>
            <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
          </div>
          <div className={styles.todoMeta}>
            <span data-priority={todo.priority}>{todo.priority}</span>
            <span>{todo.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
