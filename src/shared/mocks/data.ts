import type {
  Todo,
  TodoPriority,
  TodoStatus,
} from "../../entities/todo/model/types";

const priorities: TodoPriority[] = ["low", "normal", "high"];
const statuses: TodoStatus[] = ["active", "done"];

export const todos: Todo[] = Array.from({ length: 64 }, (_, index) => {
  const number = index + 1;

  return {
    id: String(number),
    title: `Review React task item ${number}`,
    priority: priorities[index % priorities.length],
    status: statuses[index % statuses.length],
    createdAt: new Date(2026, index % 5, (index % 27) + 1).toISOString(),
  };
});
