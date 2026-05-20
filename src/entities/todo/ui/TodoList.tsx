import type { Todo } from "../model/types";

type TodoListProps = {
  items: Todo[];
};

export function TodoList({ items }: TodoListProps) {
  if (items.length === 0) {
    return <p className="emptyState">No todos found</p>;
  }

  return (
    <ul className="todoList">
      {items.map((todo, index) => (
        <li className="todoItem" key={`${todo.id}-${index}`}>
          <div>
            <strong>{todo.title}</strong>
            <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="todoMeta">
            <span data-priority={todo.priority}>{todo.priority}</span>
            <span>{todo.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
